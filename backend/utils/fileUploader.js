const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileUploader = (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    // Configuration
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024;
    form.multiples = true;

    form.on("fileBegin", (name, file) => {
      const filePath = path.join(uploadDir, file.originalFilename);
      file.filepath = filePath;
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(new Error("File parsing failed: " + err.message));
      }

      const fileArray = Array.isArray(files.file)
        ? files.file
        : files.file
        ? [files.file]
        : [];
      const uploadedFiles = [];

      if (fileArray.length === 0) {
        return resolve({ fields, files: [] });
      }

      for (const file of fileArray) {
        if (file && file.filepath) {
          uploadedFiles.push({
            fileName: file.originalFilename,
            filePath: file.filepath,
            mimeType: file.mimetype,
            fileSize: file.size,
          });
        }
      }

      resolve({ fields, files: uploadedFiles });
    });
  });
};

module.exports = fileUploader;
