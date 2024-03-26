// ClusteraApp.jsx
import React, { useState, useEffect } from 'react';
import { Upload } from "./Upload";
import { Link } from "react-router-dom";
import NavigationBar from '../../components/navbar.js';
import PurpleWave from '../../components/wave.js'

const UploadPage = () => {
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    // Disable scrollbar on page load
    document.body.style.overflow = 'hidden';

  }, []);

  const handleFileChange = (event) => {
    const { value } = event.target;
    setFileName(value.split('\\').pop());
  };

  return (
    <div>
      <NavigationBar />
      <div class="flex flex-col items-center justify-center h-screen text-center ">
        <h3 class="w-3/5 font-bold mx-auto bg-gradient-to-r from-yellow-500 from-10% to-pink-500 to-90% text-transparent bg-clip-text text-[40px]">Welcome to</h3>
        <h1 class="w-1/5 font-bold mx-auto bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clustera</h1>
        <div class="text-[15px] font-bold text-black-700">An application that allows you to Cluster, Categorize and Classify Textual Documents</div>
        <Upload />
        <PurpleWave />
      </div>

    </div >
  );
};

export default UploadPage;
