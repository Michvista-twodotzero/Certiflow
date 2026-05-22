const fs = require('fs');
const path = require('path');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

const { auditReport } = require('../dist/agent/auditor');
const { extractDocumentContent } = require('../dist/ingestion/pipeline');

const TEMP_DIR = path.join(__dirname, '..', '..', '..', 'tmp', 'ai-smoke-test');
const SIGN_IMAGE_URL = 'https://commons.wikimedia.org/wiki/Special:FilePath/Danger%20Construction%20Area%20and%20Hard%20Hat%20Area%20signs.jpg';

async function main() {
  ensureEnv();
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const reportPath = path.join(TEMP_DIR, 'site-report.txt');
  const imagePath = path.join(TEMP_DIR, 'construction-sign.jpg');

  fs.writeFileSync(
    reportPath,
    [
      'Daily site report for Block A excavation.',
      'Workers entered a trench with no documented competent person inspection.',
      'A scaffold platform more than 10 feet above grade had no visible guardrail and one worker had no harness.',
      'Two laborers were observed without hard hats near overhead work.',
      'Combustible materials were stored beside an active welding area with no extinguisher nearby.',
    ].join('\n'),
    'utf-8',
  );

  await downloadFile(SIGN_IMAGE_URL, imagePath);

  const server = await startStaticServer(TEMP_DIR);

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const reportUrl = `${baseUrl}/site-report.txt`;

    const auditResult = await auditReport(reportUrl, 'Smoke Test Project');
    const ocrResult = await extractDocumentContent(imagePath, SIGN_IMAGE_URL);
    const imageAuditResult = await auditReport(`${baseUrl}/construction-sign.jpg`, 'Smoke Test Project');

    console.log(JSON.stringify({
      reportAudit: {
        actionableCount: auditResult.actionableCount,
        summary: auditResult.summary,
        firstViolation: auditResult.violations[0] || null,
        extraction: auditResult.extraction,
      },
      ocrExtraction: {
        strategy: ocrResult.strategy,
        sourceKind: ocrResult.sourceKind,
        ocrPerformed: ocrResult.ocrPerformed,
        ocrProvider: ocrResult.ocrProvider || null,
        ocrConfidence: ocrResult.ocrConfidence || null,
        preview: ocrResult.content.slice(0, 240),
      },
      imageAudit: {
        actionableCount: imageAuditResult.actionableCount,
        summary: imageAuditResult.summary,
        extraction: imageAuditResult.extraction,
      },
    }, null, 2));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function ensureEnv() {
  const required = ['GEMINI_API_KEY', 'OCR_PROVIDER'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars for smoke test: ${missing.join(', ')}`);
  }
}

function startStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    const requestPath = new URL(req.url, 'http://127.0.0.1').pathname;
    const filePath = path.join(rootDir, requestPath === '/' ? 'site-report.txt' : requestPath.slice(1));

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.txt': 'text/plain; charset=utf-8',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };

    res.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function downloadFile(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destination, buffer);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
