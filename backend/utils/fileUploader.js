const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const fileUploader = (req, res, subdir) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "..", `uploads/${subdir}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    console.log(files);
    console.log(fields);
    return 0;
    let file = files.newFile;
    let oldPath = file.filepath;
    let newPath = path.join(uploadDir, file.originalFilename);

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
        // console.log("File uploaded successfully", newPath);
        // return res.json({ message: "Successfully uploaded", fields, files });
        return newPath;
      });
    });
  });
  // return newPath;
};

module.exports = fileUploader;
