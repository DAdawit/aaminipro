import React, { useState } from "react";
import axios from "axios";
import { IconPhoneCall, IconSend, IconBrandTelegram, IconWebhook, IconLocation } from '@tabler/icons-react'
const PdfGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState('');
  const [error, setError] = useState('');

  const generatePdf = async () => {
    setLoading(true);
    setError('');
    setPdfPath('');

    try {
      const response = await axios.post('http://127.0.0.1:4000/api/generate-pdf', {
        letterName: "Offer Letter"
      });

      if (response.data?.filePath) {
        setPdfPath(response.data.filePath);
        return window.location.href = `http://127.0.0.1:4000/${response.data.fileName}`;
      } else {
        setError("PDF was generated, but file path is missing.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="w-screen bg-white font-sans text-gray-800 p-10">
        <div className="max-w-4xl relative mx-auto border border-gray-200 p-8">
          <div className="">
            <div className="flex justify-between items-cente py-1">
              <img className="w-16 h-24" src="data:image/png;base64,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" alt="" />
              <h1 className="text-center">CITY GOVERNMENT OF ADDIS ABABA HOUSING DEVELOPMENT AND ADMINISTRATION
                BUREAU ADDIS ABABA HOUSING DEVELOPMENT CORPORATION
                ADDS ABABA HOUSING DEVELOPMENT CORPORATION</h1>
              <img className="w-16 h-24" src="data:image/png;base64,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" alt="logo" />
            </div>
            <div className="flex items-center w-full mt-1">
              <div className="w-1/2 h-2 bg-blue-400 "></div>
              <div className="w-1/2 h-2 bg-amber-400 "></div>
            </div>
          </div>


          {/* Letter Metadata */}
          <div className="flex w-full  justify-between items-center gap-3 mt-8 text-sm">
            <div className="flex items-center gap-2 w-1/2">
              <p className="w-fit font-semibold text-nowrap">Date:</p>
              <div className="border border-b-gray-900 h-1 w-full">
              </div>
            </div>
            <div className="flex items-center gap-2 w-1/2">
              <p className="w-fit font-semibold text-nowrap">Ref No:</p>
              <div className="border border-b-gray-900 h-1 w-full">
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="mt-6">
            <p className="font-semibold">Subject: [SUBJECT-OF-THE-LETTER]</p>
          </div>

          {/* Salutation */}
          <div className="mb-4">
            <p>Dear [RECIPIENT-NAME],</p>
          </div>

          {/* Letter Body */}
          <div className="mb-6 space-y-4">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>

            <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>

            <p>Phasellus auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
          </div>

          {/* footer */}
          <div className="mb-0 items-baseline-last">
            {/* top border */}
            <div className="flex items-center justify-baseline">
              <div className="h-1 w-1/2 bg-blue-700"></div>
              <div className="h-1 w-1/2 bg-amber-500"></div>
            </div>
            {/* footer content */}
            <div className="flex justify-between items-center">
              <div className="px-4 py-2">
                <IconPhoneCall />
              </div>
              <div className="px-4 py-2 border-l border-l-black">
                <IconBrandTelegram />
              </div>
              <div className="px-4 py-2 border-l border-l-black">
                <IconLocation />
              </div>
              <div className="px-4 py-2 border-l border-l-black">
                <IconSend />
              </div>
              <div className="px-4 py-2 border-l border-l-black">
                <IconWebhook />
              </div>
            </div>
            {/* bottom border */}
            <div className="flex items-center justify-baseline">
              <div className="h-5 w-1/2 bg-blue-700"></div>
              <div className="h-5 w-1/2 bg-amber-500"></div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        onClick={generatePdf}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate PDF"}
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}
      {pdfPath && !error && <p className="mt-2 text-green-500">PDF generated successfully!</p>}
    </div>
  );
};

export default PdfGeneration;