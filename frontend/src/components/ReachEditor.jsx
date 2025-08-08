import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ReachEditor() {
  const [value, setValue] = useState("");
  const Quill = ReactQuill.Quill;
  const FontAttributor = Quill.import("attributors/class/font");
  //add your font family names in this array
  FontAttributor.whitelist = [
    "AbyssinicaSIL",
    "jiret",
    "washrab",
    "sans-serif",
    "serif",
    "monospace",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
  ];
  // Custom font families
  // Add your custom fonts to the array

  Quill.register(FontAttributor, true);

  const modules = {
    toolbar: [
      [{ font: FontAttributor.whitelist }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link", "image"],
      ["table"],
      ["clean"],
    ],
  };

  const formats = [
    "font",
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "table",
  ];
  return (
    <ReactQuill
      theme="snow"
      style={{ height: "200px" }}
      modules={modules}
      value={value}
      formats={formats}
      onChange={setValue}
    />
  );
}

export default ReachEditor;
