"use client";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextEditorDescription({ description, setDescription }) {
  // Custom font families
  const fontFamilyArr = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
    "Tahoma",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",
    "Arial Black",
    "Lucida Console",
    "Palatino",
    "Garamond",
    "Bookman",
    "Avant Garde",
    "Verdana",
    "Optima",
    "Futura",
    "Gill Sans",
  ];

  const modules = {
    toolbar: [
      [{ font: fontFamilyArr }],
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
    table: true,
    tableOptions: {
      operationMenu: {
        items: {
          unmergeCells: {
            text: "Another unmerge cells name",
          },
        },
      },
    },
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
    <div>
      <ReactQuill
        style={{ height: "200px" }}
        theme="snow"
        value={description}
        modules={modules}
        formats={formats}
        onChange={setDescription}
      />
    </div>
  );
}
