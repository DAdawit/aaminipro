// import React from "react";
// import { Editor } from "@tinymce/tinymce-react";

// export default function Editor2() {
//   return (
//     <Editor
//       apiKey="id3pkxbrbrf03euuavfvnezxk3va45a0ia2oxf7h3dzb6r22"
//       init={{
//         plugins: [
//           // Core editing features
//           "anchor",
//           "autolink",
//           "charmap",
//           "codesample",
//           "emoticons",
//           "link",
//           "lists",
//           "media",
//           "searchreplace",
//           "table",
//           "visualblocks",
//           "wordcount",
//           // Your account includes a free trial of TinyMCE premium features
//           // Try the most popular premium features until Aug 21, 2025:
//           "checklist",
//           "mediaembed",
//           "casechange",
//           "formatpainter",
//           "pageembed",
//           "a11ychecker",
//           "tinymcespellchecker",
//           "permanentpen",
//           "powerpaste",
//           "advtable",
//           "advcode",
//           "advtemplate",
//           "ai",
//           "uploadcare",
//           "mentions",
//           "tinycomments",
//           "tableofcontents",
//           "footnotes",
//           "mergetags",
//           "autocorrect",
//           "typography",
//           "inlinecss",
//           "markdown",
//           "importword",
//           "exportword",
//           "exportpdf",
//         ],
//         toolbar:
//           "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
//         tinycomments_mode: "embedded",
//         tinycomments_author: "Author name",
//         mergetags_list: [
//           { value: "First.Name", title: "First Name" },
//           { value: "Email", title: "Email" },
//         ],
//         ai_request: (request, respondWith) =>
//           respondWith.string(() =>
//             Promise.reject("See docs to implement AI Assistant")
//           ),
//         uploadcare_public_key: "5f124cd057c882b17dd5",
//       }}
//       initialValue="Welcome to TinyMCE!"
//     />
//   );
// }

// src/Tiptap.tsx
// src/Tiptap.tsx
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { useMemo } from 'react'

const Editor2 = () => {
  const editor = useEditor({
    extensions: [StarterKit], // define your extension array
    content: "<p>Hello World!</p>", // initial content
  });

  // Memoize the provider value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </EditorContext.Provider>
  );
};

export default Editor2;
