import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useParams } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.js';

function LDApage() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);

  useEffect(() => {
    // This will log the updated state whenever the component mounts
    console.log(uploadedData)
    console.log(preprocessedText)

  }, []); // Empty dependency array ensures the effect runs only once

  // const preprocessText = async () => {
  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/lda', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(uploadedData),
  //     });

  //     const responseData = await response.json();
  //     setResponseInfo(responseData.preprocessed_text);
  //   } catch (error) {
  //     console.error('Error during text preprocessing:', error);
  //     // Handle errors if necessary
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div class="">
      <h1 class="text-center bg-red-400 font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clusters LDA</h1>
      <div class="flex items-center justify-center mb-5">
        <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center flex items-center" onClick={() => console.log("red")}>
          Cluster Using LDA
        </button>
      </div>
    </div>
  );
}

export default LDApage;
