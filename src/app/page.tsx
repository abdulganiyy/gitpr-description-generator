"use client";
import { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { parseMarkdown } from "../../helpers";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export default function Home() {
  const textareaRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [diff, setDiff] = useState<any>("");
  const [pr, setPr] = useState<string>("");
  const [uploadedFileContent, setUploadedFileContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const html = parseMarkdown(pr);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      // textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"; // Limit max height
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        setUploadedFileName(file.name);
        setUploadedFileContent(content);
      };
      reader.readAsText(file);
    } else {
      alert("Only .txt files are allowed");
      event.target.value = ""; // Clear invalid file
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const message = textareaRef.current.value.trim();

    if (!message && !uploadedFileContent) return;

    if (message || uploadedFileContent) {
      // console.log("Sending:", message);

      let processedmessage = [message, uploadedFileContent]
        .filter(Boolean)
        .join("");

      let prompt = `Analyze the following Git diff and generate a detailed pull request description:\n\n${processedmessage}`;
      setLoading(true);

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        console.log(response.text);

        // Reset input
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";

        setDiff(message);
        setPr(response.text as string);
      } catch (error) {
        console.error("Error calling Gemini API:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-400">
      <div className="flex flex-col w-full h-[750px] md:w-3/4 m-auto">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {diff && (
            <div className="flex items-start gap-2.5">
              <div className="flex flex-col w-full max-w-[520px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {/* Bonnie Green */} You
                  </span>
                  {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  11:46
                </span> */}
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                  {/* That's awesome. I think our users will really appreciate the
                improvements. */}
                  {diff}
                </p>
                {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Delivered
              </span> */}
              </div>
            </div>
          )}
          {pr && (
            <div className="flex items-start justify-end gap-2.5">
              <div className="flex flex-col w-full max-w-[520px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-tl-xl rounded-b-xl dark:bg-gray-700">
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
              </div>
            </div>
          )}
        </div>
        {/* Input Box */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 mx-auto p-6 bg-gray-700 rounded-xl"
          >
            {/* File Preview */}
            {uploadedFileName && (
              <div className="text-sm bg-gray-100 rounded-lg p-2 border border-gray-300 relative">
                <div className="font-semibold text-gray-800 mb-1">
                  {uploadedFileName}
                </div>
                <pre className="whitespace-pre-wrap text-gray-700 max-w-12 max-h-12 overflow-y-auto text-sm">
                  {uploadedFileContent}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFileName("");
                  }}
                  className="absolute -top-2 right-1 text-red-500 text-xs hover:underline"
                >
                  ✕
                </button>
              </div>
            )}
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-700 hover:bg-gray-200"
            >
              📎
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow rounded-full bg-transparent text-gray-100  border-0 px-4 py-2 focus:outline-none focus:ring-0"
            /> */}
            <textarea
              id="message"
              ref={textareaRef}
              onChange={handleInput}
              rows={1}
              placeholder="Paste your git diff content..."
              className="flex-grow resize-none overflow-y-auto rounded-xl bg-inherit px-4 py-2 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className=" text-white border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-700 transition"
            >
              {loading && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
              )}

              {loading ? "" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
