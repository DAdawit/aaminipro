const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const fileUploader = require("../utils/fileUploader");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const { registerPermission } = require("../controllers/permission.controller");
router.get("/", (req, res) => {
  res.send({
    message: "wellcome",
  });
});

router.get("/users", userController.index);
router.get("/users/count", userController.getUserCount);
router.get("/users/:id", userController.getUser);
router.post("/users", userController.registerUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/verifyToken", userController.verifyToken);
// permission routes
router.post('/permission/register', registerPermission)
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", userController.updateUser);
router.put("/users/updateProfile/:id", userController.updateProfilePicture);
// genrate it 
router.post('/generate-pdf', async (req, res) => {
  try {
    const { letterName } = req.body;

    if (!letterName) {
      return res.status(400).send('Missing "letterName" in request body');
    }

    const html = `
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    
    body {
      font-family: 'Roboto', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      opacity: 0.1;
      font-size: 80px;
      font-weight: bold;
      z-index: 0;
      color: #555;
      pointer-events: none;
      width: 100%;
      text-align: center;
      white-space: nowrap;
    }

    .letter-container {
      width: 100%;
      margin: 40px auto;
      background-color: white;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      border: none;
      position: relative;
      z-index: 1;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 40px 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    .header img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }

    .header h1 {
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.4;
      margin: 0 20px;
      color: #1a365d;
    }

    .divider {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .divider-blue {
      width: 50%;
      height: 4px;
      background-color: #1a56db;
    }

    .divider-amber {
      width: 50%;
      height: 4px;
      background-color: #d97706;
    }

    .letter-content {
      padding: 30px 40px;
      flex-grow: 1;
    }

    .metadata {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin: 30px 0;
    }

    .metadata-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 50%;
    }

    .metadata-label {
      width: fit-content;
      font-weight: 600;
      white-space: nowrap;
      color: #555;
    }

    .metadata-line {
      border-bottom: 1px solid #cbd5e0;
      height: 1px;
      width: 100%;
      flex-grow: 1;
    }

    .subject {
      margin: 30px 0 20px;
      font-weight: 600;
      color: #1a365d;
      font-size: 18px;
    }

    .salutation {
      margin-bottom: 20px;
    }

    .body {
      margin-bottom: 30px;
    }

    .body p {
      margin-bottom: 15px;
      text-align: justify;
    }

    .footer {
      margin-top: auto;
      background-color: #f8fafc;
      padding: 20px 0 0;
    }

    .footer-top {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .footer-top-blue {
      height: 2px;
      width: 50%;
      background-color: #1a56db;
    }

    .footer-top-amber {
      height: 2px;
      width: 50%;
      background-color: #d97706;
    }

    .footer-content {
      text-align: center;
      padding: 15px;
      color: #666;
      font-size: 14px;
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .footer-bottom-blue {
      height: 10px;
      width: 50%;
      background-color: #1a56db;
    }

    .footer-bottom-amber {
      height: 10px;
      width: 50%;
      background-color: #d97706;
    }

    /* Print styles */
    @media print {
      body {
        background-color: white;
        padding: 0;
      }
      .letter-container {
        box-shadow: none;
        margin: 0;
        max-width: 100%;
      }
      .watermark {
        opacity: 0.15;
      }
    }
  </style>
</head>
<body>
  <div class="watermark">CONFIDENTIAL</div>
  
  <div class="letter-container">
    <div class="header">
      <img src="data:image/png;base64,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" alt="Logo" />
      <h1>CITY GOVERNMENT OF ADDIS ABABA HOUSING DEVELOPMENT AND ADMINISTRATION<br>
        BUREAU ADDIS ABABA HOUSING DEVELOPMENT CORPORATION<br>
        ADDS ABABA HOUSING DEVELOPMENT CORPORATION</h1>
      <img src="data:image/png;base64,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" alt="Logo" />
    </div>
    <div class="divider">
      <div class="divider-blue"></div>
      <div class="divider-amber"></div>
    </div>

    <div class="letter-content">
      <!-- Letter Metadata -->
      <div class="metadata">
        <div class="metadata-item">
          <p class="metadata-label">Date:</p>
          <div class="metadata-line"></div>
        </div>
        <div class="metadata-item">
          <p class="metadata-label">Ref No:</p>
          <div class="metadata-line"></div>
        </div>
      </div>

      <!-- Subject Line -->
      <div class="subject">
        <p>Subject: [SUBJECT-OF-THE-LETTER]</p>
      </div>

      <!-- Salutation -->
      <div class="salutation">
        <p>Dear [RECIPIENT-NAME],</p>
      </div>

      <!-- Letter Body -->
      <div class="body">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>

        <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>

        <p>Phasellus auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
      </div>
    </div>

    <!-- footer -->
    <div class="footer">
      <!-- top border -->
      <div class="footer-top">
        <div class="footer-top-blue"></div>
        <div class="footer-top-amber"></div>
      </div>
      <!-- footer content -->
      <div class="footer-content">Official Document - For Authorized Use Only</div>
      <!-- bottom border -->
      <div class="footer-bottom">
        <div class="footer-bottom-blue"></div>
        <div class="footer-bottom-amber"></div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 60000
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const fileName = `${Date.now()}.pdf`;
    const outputDir = path.join(__dirname, "..", 'uploads');
    const outputPath = path.join(outputDir, fileName);

    fs.mkdirSync(outputDir, { recursive: true });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
    });

    await browser.close();

    res.json({
      message: 'PDF generated successfully',
      fileName,
      filePath: `/uploads/${fileName}`
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.post("/upload-file", function async(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "..", "uploads/userPprofile");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let file = files.profilePicture[0];
    let oldPath = file.filepath;
    let timestamp = Date.now();
    let newPath = path.join(uploadDir, `${timestamp}_${file.originalFilename}`);
    let imagePath = `/uploads/userPprofile/${timestamp}_${file.originalFilename}`;
    fs.readFile(oldPath, (err, rawData) => {
      if (err) {
        console.log(err);
        return res.status(500).send("File read error");
      }
      fs.writeFile(newPath, rawData, function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send("File save error");
        }
        console.log("File uploaded successfully", newPath);
        return res.json({
          message: "Successfully uploaded",
          fields,
          files,
          imagePath,
        });
      });
    });
  });
});

module.exports = router;
