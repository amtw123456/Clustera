import { PDocumentsCard, UDocumentsCard, WordCountCard } from '../../components/docscard.js'
import React, { useEffect, useState, useContext } from "react";
import { Link, json, useLocation, useParams } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.js';
import NavigationBar from '../../components/navbar.js';

function LSApage() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { wordCounts, setWordCounts } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const [isRawDocumentsBool, setIsRawDocumentsBool] = useState(true);
  const [isPreProcessedBool, setIsPreProcessedBool] = useState(false);
  const [isDocumentWordCountBool, setIsDocumentWordCountBool] = useState(false);

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

  const togglePreProcessedBool = () => {

    setIsPreProcessedBool(true);
    setIsRawDocumentsBool(false);
    setIsDocumentWordCountBool(false);

  };

  const toggleRawDocumentsBool = () => {

    setIsPreProcessedBool(false);
    setIsRawDocumentsBool(true);
    setIsDocumentWordCountBool(false);
  };

  const toggleDocumentWordCountBool = () => {

    setIsPreProcessedBool(false);
    setIsRawDocumentsBool(false);
    setIsDocumentWordCountBool(true);

  };

  return (
    <div class="">
      <NavigationBar />


      <nav class="py-4 px-4 top-0 left-0 right-0 z-0">
        <div class="flex">
          {/* <div class="hidden md:flex space-x-4 justify-center flex-1">
                    <a href="#" class="text-white text-2xl">{middleText}</a>
                </div> */}
          <div class="ml-80 hidden md:flex flex-1">
            {isPreProcessedBool ? (
              <button href="#" class="text-black text-base border-x border-t px-10 pt-1" disabled={true}>Documents Summary</button>
            ) : (
              <button href="#" class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => togglePreProcessedBool()}>Documents Summary</button>
            )}
            {isDocumentWordCountBool ? (
              <button href="/" class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Clusters</button>
            ) : (
              <button href="/" class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleDocumentWordCountBool()}>Clusters Generated</button>
            )}
            {isDocumentWordCountBool ? (
              <button href="/" class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Document Topic Distribution</button>
            ) : (
              <button href="/" class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleDocumentWordCountBool()}>Document Topic Distribution</button>
            )}
            {isDocumentWordCountBool ? (
              <button href="/" class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Topics Generated</button>
            ) : (
              <button href="/" class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleDocumentWordCountBool()}>Topics Generated</button>
            )}
            {isDocumentWordCountBool ? (
              <button href="/" class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Classifier</button>
            ) : (
              <button href="/" class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleDocumentWordCountBool()}>Classifier</button>
            )}
            {isDocumentWordCountBool ? (
              <button href="/" class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Visualize</button>
            ) : (
              <button href="/" class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleDocumentWordCountBool()}>Visualize</button>
            )}
            {isDocumentWordCountBool ? (
              <button href="/" class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Export</button>
            ) : (
              <button href="/" class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleDocumentWordCountBool()}>Export</button>
            )}

            <a href="/" class="text-blue-400 text-base border-b pr-32 pt-1"></a>
          </div>
        </div>
      </nav >

      <div class="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
        <div class="ml-4 pt-4 font-bold text-2xl">LSA Clustering</div>
        <ul class="mt-12">
          {/* <li><Link to="/" class="block py-2 px-6 text-black hover:bg-gray-300">Upload</Link></li> */}
          <li onClick={() => clusterUsingLsa()}><Link to="/cluster_page_lsa" class="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LSA</Link></li>
          <li><Link to="/cluster_page_lda" class="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LDA</Link></li>
        </ul>
      </div>

      <div class="ml-80 flex flex-wrap items-center">
        {
          uploadedData.length > 0 ? (
            uploadedData.map((item, index) => (
              <UDocumentsCard key={index} index={index} item={item} />
            ))
          ) : (
            <div class="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">There are no Documents loaded yet to the page please Upload a JSON or CSV file.</div>
              <Link to="/"><div class="text-center text-blue-600 text-xl underline-offset-4">Go to Upload Page</div></Link>
            </div>
          )
        }
      </div >

    </div >
  );
}

export default LSApage;
