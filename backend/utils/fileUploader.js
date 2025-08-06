const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

const fileUploader = (req, subdir) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) return reject("Form parse error");

      const uploadDir = path.join(__dirname, "..", "uploads", subdir);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Support both array and object for files.newFile
      let file = files.newFile;
      if (Array.isArray(file)) file = file[0];
      if (!file) return reject("No file uploaded");

      const oldPath = file.filepath;
      const newPath = path.join(uploadDir, file.originalFilename);

      fs.readFile(oldPath, (err, rawData) => {
        if (err) return reject("File read error");
        fs.writeFile(newPath, rawData, function (err) {
          if (err) return reject("File save error");
          resolve({
            message: "Successfully uploaded",
            path: newPath,
            fields,
            files,
          });
        });
      });
    });
  });
};

module.exports = fileUploader;
