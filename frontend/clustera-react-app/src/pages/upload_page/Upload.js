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

  const handleChange = (e) => {
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
      <label htmlFor="fileInput" class="w-92 h-13 mt-4 mx-auto border-2 border-gray-500 text-gray-500 px-4 py-2 bg-white rounded-lg text-sm font-bold cursor-pointer">
        Upload JSON or CSV file
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      <div class="border-gray-400 px-2 mb-3 py-1 mt-4 border-2 rounded-lg text-sm font-bold hover:bg-gray-200">
        <Link to="/documentsPage">Cluster Documents</Link>
      </div>
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
