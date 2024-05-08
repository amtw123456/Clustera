// ClusteraApp.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Upload } from "./Upload.jsx";
import NavigationBar from '../../components/navbar.jsx';
import PurpleWave from '../../components/wave.jsx'

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
      <div className="flex flex-col items-center h-screen text-center ">
        <div className="w-36 h-36"></div>
        <h3 className="w-3/5 font-bold mx-auto bg-gradient-to-r from-yellow-500 from-10% to-pink-500 to-90% text-transparent bg-clip-text text-[40px]">Welcome to</h3>
        <h1 className="w-1/5 font-bold mx-auto bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clustera</h1>
        <div className="text-[15px] font-bold text-black-700">An application that allows you to Cluster, Categorize and Classify Textual Documents</div>
        <Upload />
        <PurpleWave />
      </div>

    </div >
  );
};

export default UploadPage;
