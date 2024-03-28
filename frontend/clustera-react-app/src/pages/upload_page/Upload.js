import React, { useState, useEffect, useContext } from "react";
import { AppContext } from '../../providers/AppState.js';
import { Link } from "react-router-dom";

export function Upload() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  // const [uploadedData, setUploadedData] = useContext(AppContext);
  const [files, setFiles] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    // This will log the updated jsonData whenever it changes
    setUploadedData(jsonData);

  }, [jsonData]);

  const uploadDocuments = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");

      fileReader.onload = (e) => {
        const content = e.target.result;
        setFiles(content);
        setFileName(file.name);

        try {
          const parsedJson = JSON.parse(content);
          setJsonData(parsedJson);

        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
    }
  };

  return (
    <>
      <label htmlFor="fileInput" class="w-92 h-13 mt-4 mx-auto border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
        Upload File
      </label>


      <input
        type="file"
        id="fileInput"
        onChange={uploadDocuments}
        style={{ display: 'none' }}
      />
      <Link to="/documentsPage">
        <button class="bg-purple-500 text-white px-8 py-2 mb-3 py-2 mt-4 rounded-lg text-sm font-bold hover:bg-purple-700">
          Cluster Documents
        </button >
      </Link>
      <div>
        {fileName ? (
          <p>File Upload Complete!!!</p>
        ) : (
          <p>No file uploaded yet.</p>
        )}
      </div>
    </>
  );
}
