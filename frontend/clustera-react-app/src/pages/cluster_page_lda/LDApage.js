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

  return (
    <div class="">
      <h1 class="text-center bg-red-400 font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clusters LDA</h1>
    </div>
  );
}

export default LDApage;
