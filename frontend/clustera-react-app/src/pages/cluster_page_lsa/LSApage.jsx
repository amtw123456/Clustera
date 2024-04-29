import { PDocumentsCard, UDocumentsCard, WordCountCard } from '../../components/docscard.jsx'
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.jsx';
import NavigationBar from '../../components/navbar.jsx';

function LSApage() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { documentsProvider, setDocumentsProvider } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const [isDocumentSummaryBool, setIsDocumentSummaryBool] = useState(true);
  const [isClusteredGeneratedBool, setIsClusteredGeneratedBool] = useState(false);
  const [isDocumentTopicDistributionBool, setIsDocumentTopicDistributionBool] = useState(false);
  const [isTopicsGeneratedBool, setIsTopicsGeneratedBoolBool] = useState(false);
  const [isClassifierBool, setIsClassifierBool] = useState(false);
  const [isVisualizeBool, setIsVisualizeBool] = useState(false);
  const [isExportBool, setIsExportBool] = useState(false);

  const toggleBoolUtilisBar = (stateName) => {
    // Create an object to map state names to their corresponding setter functions
    const stateSetterMap = {
      isDocumentSummaryBool: setIsDocumentSummaryBool,
      isClusteredGeneratedBool: setIsClusteredGeneratedBool,
      isDocumentTopicDistributionBool: setIsDocumentTopicDistributionBool,
      isTopicsGeneratedBool: setIsTopicsGeneratedBoolBool,
      isClassifierBool: setIsClassifierBool,
      isVisualizeBool: setIsVisualizeBool,
      isExportBool: setIsExportBool
    };

    if (stateName in stateSetterMap) {
      for (const key in stateSetterMap) {
        if (stateName == key) {
          stateSetterMap[key](true);
        }
        else {
          stateSetterMap[key](false);
        }
      }

    } else {
      console.error(`State ${stateName} does not exist`);
    }
  };

  useEffect(() => {
    // This will log the updated state whenever the component mounts
    console.log(uploadedData)
    console.log(preprocessedText)
    console.log(JSON.stringify({ "preprocessed_text": preprocessedText, "num_topics": 10 }))

  }, []);

  const clusterUsingLsa = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://127.0.0.1:8000/lsa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "preprocessed_text": preprocessedText, "num_topics": 10 }),
      });

      const responseData = await response.json();
      console.log(responseData)
    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);


    }
  };

  return (
    <div className="">
      <NavigationBar />

      <nav className="py-4 px-4 top-0 left-0 right-0 z-0">
        <div className="flex">
          <div className="ml-80 hidden md:flex flex-1">
            {isDocumentSummaryBool ? (
              <button href="#" className="text-black text-base border-x border-t px-10 pt-1" disabled={true}>Documents Summary</button>
            ) : (
              <button href="#" className="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentSummaryBool')}>Documents Summary</button>
            )}
            {isClusteredGeneratedBool ? (
              <button href="/" className="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Clusters Generated</button>
            ) : (
              <button href="/" className="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isClusteredGeneratedBool')}>Clusters Generated</button>
            )}
            {isDocumentTopicDistributionBool ? (
              <button href="/" className="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Document Topic Distribution</button>
            ) : (
              <button href="/" className="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentTopicDistributionBool')}>Document Topic Distribution</button>
            )}
            {isTopicsGeneratedBool ? (
              <button href="/" className="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Topics Generated</button>
            ) : (
              <button href="/" className="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isTopicsGeneratedBool')}>Topics Generated</button>
            )}
            {isClassifierBool ? (
              <button href="/" className="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Classifier</button>
            ) : (
              <button href="/" className="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isClassifierBool')}>Classifier</button>
            )}
            {isVisualizeBool ? (
              <button href="/" className="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Visualize</button>
            ) : (
              <button href="/" className="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isVisualizeBool')}>Visualize</button>
            )}
            {isExportBool ? (
              <button href="/" className="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Export</button>
            ) : (
              <button href="/" className="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isExportBool')}>Export</button>
            )}

            <a href="/" className="text-blue-400 text-base border-b pr-32 pt-1"></a>
          </div>
        </div>
      </nav >

      <div className="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
        <div className="ml-4 pt-4 font-bold text-2xl">LSA Clustering</div>
        <ul className="mt-12">
          {/* <li><Link to="/" className="block py-2 px-6 text-black hover:bg-gray-300">Upload</Link></li> */}
          <li onClick={() => clusterUsingLsa()}><Link to="/cluster_page_lsa" className="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LSA</Link></li>
          <li><Link to="/cluster_page_lda" className="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LDA</Link></li>
        </ul>
      </div>

      <div className="ml-80 flex flex-wrap items-center">
        {/* {
          uploadedData.length > 0 ? (
            uploadedData.map((item, index) => (
              <UDocumentsCard key={index} index={index} item={item} />
            ))
          ) : (
            <div className="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">There are no Documents loaded yet to the page please Upload a JSON or CSV file.</div>
              <Link to="/"><div className="text-center text-blue-600 text-xl underline-offset-4">Go to Upload Page</div></Link>
            </div>
          )
        } */}
      </div >

    </div >
  );
}

export default LSApage;
