import React, { useEffect, useState } from "react";
import { Link, json, useLocation, useParams } from 'react-router-dom'

function DocPage() {
  const { type } = useParams();
  const jsonData = useLocation().state.documents;
  const [newJsonData, setNewJsonData] = useState([]);
  const [responseInfo, setResponseInfo] = useState([]);
  const [isPreProcessed, setIsPreProcessed] = useState(false);
  const [isPreProcessedBool, setIsPreProcessedBool] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This will log the updated state whenever the component mounts
    setNewJsonData(jsonData)
  }, []);

  useEffect(() => {
    // This will log the updated state whenever the component mounts
    console.log(newJsonData)
    setNewJsonData(responseInfo)
    console.log(responseInfo)
  }, [responseInfo]); // Empty dependency array ensures the effect runs only once

  const togglePreProcessedBool = () => {
    setIsPreProcessedBool((prevValue) => !prevValue);
  };

  const preprocessText = async () => {
    setIsPreProcessed((prevValue) => !prevValue);
    setIsPreProcessed(true);
    try {
      setIsLoading(true);

      const response = await fetch('http://127.0.0.1:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const responseData = await response.json();
      setResponseInfo(responseData.preprocessed_text);
    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="">
      <div class="mx-auto w-3/5">
        <h1 class="text-center bg-red-400 font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Documents Page</h1>
        {/* <h1 class="font-bold bg-red-500 text-[88px]">Documents Page</h1> */}
      </div>
      <div class="flex items-center justify-center mb-5">
        <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center flex items-center">
          <Link to="/" state={{
            documents: jsonData
          }}
          >Go to Upload Page</Link>
        </button>
      </div>
      <div class="flex items-center justify-center mb-5">
        {/* <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick = {() => preprocessText()}>
          Text Pre-Processing
        </button> */}
        {/* {isPreProcessed ? (
              <button class="w-60 bg-gray-500 mx-3 text-white font-bold py-2 px-4 rounded" disabled={!false}>{"Text Pre-Processing"}</button>
          ) : (
              <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick = {() => preprocessText()}>{"Text Pre-Processing"}</button>
          )} */}
        {
          isLoading ? (
            // <div>
            //     <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            //         <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            //         <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            //     </svg>
            //     <span class="sr-only">Loading...</span>
            // </div>
            <div>
              <button disabled type="button" class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center flex items-center">
                <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                Loading...
              </button>
            </div>
          ) : (
            isPreProcessed ? (
              <button className="w-60 bg-gray-500 mx-3 text-white font-bold py-2 px-4 rounded" disabled>
                {"Text Pre-Processing"}
              </button>
            ) : (
              <button className="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => preprocessText()}>
                {"Text Pre-Processing"}
              </button>
            )
          )
        }
      </div>

      <div class="flex items-center justify-center mb-3">
        <button
          class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!false}
        >
          <Link to="/cluster_page_lsa" state={{ documents: jsonData }}>
            Cluster Using LSA
          </Link>
        </button>

        <button
          class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!false}
        >
          <Link to="/cluster_page_lda" state={{ documents: jsonData }}>
            Cluster Using LDA
          </Link>
        </button>
      </div>

      <div class="flex items-center justify-center mb-3">
        <div class="flex flex-wrap">
          {isPreProcessedBool ? (
            <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => togglePreProcessedBool()}>{"Un Pre-Processed Text"}</button>
          ) : (
            <button class="w-60 bg-gray-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => togglePreProcessedBool()}>{"Un Pre-Processed Text"}</button>
          )}
        </div>
        <div class="flex flex-wrap">
          {isPreProcessedBool ? (
            <button class="w-60 bg-gray-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => togglePreProcessedBool()}>{"Pre-Processed Text"}</button>
          ) : (
            <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => togglePreProcessedBool()}>{"Pre-Processed Text"}</button>
          )}
        </div>
      </div>


      <div class="flex flex-wrap justify-center items-center">
        {isPreProcessedBool > 0 ? (
          isLoading ? (
            <div class="text-center">
              <div role="status">
                <svg aria-hidden="true" class="mt-24 inline w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            responseInfo.map((item, index) => (
              <div class="w-1/2 h-20 border" key={index}>
                <div class="my-2 pb-2 pt-2 px-3">{index + 1 + ". " + item.postText.slice(0, 150)}</div>
              </div>
            ))
          )
        ) : (
          jsonData.map((item, index) => (
            <div class="w-1/2 h-20 border" key={index}>
              <div class="my-2 pb-2 pt-2 px-3">{index + 1 + ". " + item.postText.slice(0, 150) + "......."}</div>
            </div>

          ))
        )}
      </div>

    </div>
  );
}

export default DocPage;
