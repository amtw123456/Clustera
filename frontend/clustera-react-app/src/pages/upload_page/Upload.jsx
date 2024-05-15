import React, { useState, useEffect, useContext } from "react";
import { Document } from '../../modals/modals.js'
import { AppContext } from '../../providers/AppState.jsx';
import { Link } from "react-router-dom";

export function Upload() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { documentsProvider, setDocumentsProvider } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const [files, setFiles] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    setUploadedData(jsonData);
    buildDocumentsFromUpload(jsonData);
  }, [jsonData]);

  const uploadDocuments = (e) => {
    const file = e.target.files[0];
    setIsLoading(true);

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
      setTimeout(() => {
        setIsLoading(false);
      }, 3500);
    }
  };

  const buildDocumentsFromUpload = async (data) => {

    var listOfDocuments = []
    data.map((item, index) => (
      listOfDocuments.push(new Document(index, item.text, null, null, null, null, null, null))
    ))

    setDocumentsProvider(listOfDocuments);

  };

  return (
    <>
      <label htmlFor="fileInput" className="w-92 h-13 mt-4 mx-auto border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
        Upload File
      </label>

      <div class="mt-3 flex flex-row">
        <button onClick={() => null}>
          {
            isLoading ? (
              <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            ) :
              < div className="text-white block py-2 px-5 w-36 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                Export Mode
              </div>
          }
        </button>
        <button onClick={() => null} class="ml-4">
          {
            isLoading ? (
              <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            ) :
              < div className="text-white block py-2 px-5  w-36 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                Easy Mode
              </div>
          }
        </button>
      </div>


      <input
        type="file"
        id="fileInput"
        onChange={uploadDocuments}
        style={{ display: 'none' }}
      />
      {
        isLoading || uploadedData.isEmpty ? (
          <Link to="/documentsPage">
            <button className="bg-gray-500 text-white px-8 py-2 mb-3 py-2 mt-4 rounded-lg text-sm font-bold hover:bg-gray-500" disabled={true}>
              Cluster Documents
            </button >
          </Link >
        ) :
          <Link to="/documentsPage">
            <button className="bg-purple-500 text-white px-8 py-2 mb-3 py-2 mt-4 rounded-lg text-sm font-bold hover:bg-purple-700" disabled={false}>
              Cluster Documents
            </button >
          </Link >
      }

      {/* <Link to="/documentsPage">
        <button className="bg-purple-500 text-white px-8 py-2 mb-3 py-2 mt-4 rounded-lg text-sm font-bold hover:bg-purple-700">
          Cluster Documents
        </button >
      </Link > */}
      <div>
        {fileName ? (
          isLoading ? (
            <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          ) :
            <div>
              <p>File Upload Complete!!!</p>
              <p className="font-bold">{fileName}</p>
            </div >

        ) : (
          <p>No file uploaded yet.</p>
        )
        }
      </div >
    </>
  );
}
