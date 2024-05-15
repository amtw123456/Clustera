// ClusteraApp.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Upload } from "./Upload.jsx";
import NavigationBar from '../../components/navbar.jsx';
import PurpleWave from '../../components/wave.jsx'
import { AppContext } from '../../providers/AppState.jsx';

const UploadPage = () => {
  const [fileName, setFileName] = useState('');
  const { developerMode, setDeveloperMode } = useContext(AppContext);

  useEffect(() => {
    // Disable scrollbar on page load
    document.body.style.overflow = 'hidden';


  }, []);


  const handleDeveloperModeChange = (e) => {
    if (developerMode === "Easy") {
      setDeveloperMode("Expert");
    }
    else {
      setDeveloperMode("Easy");
    }
  };


  const handleFileChange = (event) => {
    const { value } = event.target;
    setFileName(value.split('\\').pop());
  };

  return (
    <div>
      <NavigationBar />
      <div className="fixed bottom-0 right-0 z-50">
        <>
          {developerMode === "Easy" ? (
            <button onClick={() => null} disabled={true} className='ml-2 my-2'>
              <div className="text-white block py-2 px-3 w-26 text-black border-blue-500 text-white px-12 py-2 bg-blue-800 rounded-lg text-xs cursor-pointer">
                Easy Mode
              </div>
            </button>
          ) : (
            <button onClick={() => handleDeveloperModeChange()} className='ml-2 my-2'>
              <div className="text-white block py-2 px-3 w-26 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-xs cursor-pointer hover:bg-blue-700">
                Easy Mode
              </div>
            </button>
          )}
        </>
        <>
          {developerMode === "Expert" ? (
            <button onClick={() => null} disabled={true} className='ml-2 mr-4 my-2'>
              <div className="text-white block py-2 px-3 w-26 text-black border-blue-500 text-white px-12 py-2 bg-blue-800 rounded-lg text-xs cursor-pointer">
                Expert Mode
              </div>
            </button>
          ) : (
            <button onClick={() => handleDeveloperModeChange()} className='ml-2 mr-4 my-2'>
              <div className="text-white block py-2 px-3 w-26 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-xs cursor-pointer hover:bg-blue-700">
                Expert Mode
              </div>
            </button>
          )}
        </>
      </div>
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
