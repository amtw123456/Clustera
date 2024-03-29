import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.js';
import NavigationBar from '../../components/navbar.js';
import LoadingScreen from "../../components/loadingscreen.js"
import { PDocumentsCard, UDocumentsCard, WordCountCard } from '../../components/docscard.js'

function DocPage() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { wordCounts, setWordCounts } = useContext(AppContext);

  const [responseInfo, setResponseInfo] = useState([]);
  const [isPreProcessed, setIsPreProcessed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setPageIsLoading] = useState(true);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);


  // bools
  const [isRawDocumentsBool, setIsRawDocumentsBool] = useState(true);
  const [isPreProcessedBool, setIsPreProcessedBool] = useState(false);
  const [isDocumentWordCountBool, setIsDocumentWordCountBool] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    setPageIsLoading(false)

  }, [uploadedData]);


  useEffect(() => {

  }, [responseInfo, preprocessedText, wordCounts]);

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
        body: JSON.stringify(uploadedData),
      });

      const responseData = await response.json();
      const contentLength = response.headers.get('Content-Length');
      console.log('Payload size:', contentLength, 'bytes');
      setResponseInfo(responseData.payload);
      setWordCounts(responseData.total_word_counts)
    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isPageLoading ? <LoadingScreen /> : (
      <div class="" >
        <NavigationBar />
        <div class="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
          <div class="ml-4 pt-4 font-bold text-2xl">Documents Hub</div>
          <ul class="mt-12">
            <li class="flex ">{
              isLoading ? (
                <div>
                  <button disabled type="button" class="block py-2 px-4 text-black flex-1">
                    <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    Loading...
                  </button>
                </div>
              ) : (
                isPreProcessed ? (
                  <button
                    className="block py-2 px-4 text-black flex-1 pr-32 hover:bg-gray-300 w-96 cursor-not-allowed hover:cursor-not-allowed"
                    disabled
                  >
                    <div>{"Text Pre-Processing"}</div>
                  </button>
                ) : (
                  <button className="block py-2 px-4 text-black flex-1 pr-32 hover:bg-gray-300 w-96" onClick={() => preprocessText()}>
                    {"Text Pre-Processing"}
                  </button>
                )
              )
            }</li>
            <li><Link to="/cluster_page_lsa" class="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LSA</Link></li>
            <li><Link to="/cluster_page_lda" class="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LDA</Link></li>
          </ul>
        </div>
        <div class="mx-auto w-3/5">
        </div>

        <nav class="py-4 px-4 top-0 left-0 right-0 z-0">
          <div class="flex">
            <div class="ml-80 hidden md:flex flex-1">
              {isRawDocumentsBool ? (
                <button class="text-black text-base border-x border-t pl-12 pr-12 pt-1" disabled={true}>Raw Documents</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-12 pt-1" onClick={() => toggleRawDocumentsBool()}>Raw Documents</button>
              )}
              {isPreProcessedBool ? (
                <button href="#" class="text-black text-base border-x border-t px-12 pt-1" disabled={true}>Pre-Processed Documents</button>
              ) : (
                <button href="#" class="text-blue-400 text-base border-b px-12 pt-1" onClick={() => togglePreProcessedBool()}>Pre-Processed Documents</button>
              )}
              {isDocumentWordCountBool ? (
                <button href="/" class="text-black text-base border-x border-t pr-12 pl-12 pt-1" disabled={true}>Document Word Count</button>
              ) : (
                <button href="/" class="text-blue-400 text-base border-b px-12 pt-1" onClick={() => toggleDocumentWordCountBool()}>Document Word Count</button>
              )}

              <a href="/" class="text-blue-400 text-base border-b pr-96 pt-1"></a>
            </div>
          </div>
        </nav >

        <div class="ml-80 flex flex-wrap items-center">
          {isPreProcessedBool ? (
            isLoading ? (
              <div class="flex-1 mt-48 text-center">
                <div role="status">
                  <svg aria-hidden="true" class="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              responseInfo.length > 0 ? (
                <PDocumentsCard data={responseInfo} />
              ) : (
                <div class="flex-1">
                  <div className="text-center mt-80 text-gray-600 text-base dark:text-gray-400">Documents have not yet been tokenized!</div>
                  <div className="text-center text-gray-600 text-xl dark:text-gray-400">Please press the Text Pre-Processing Button.</div>
                  {/* <Link to="/"><div class="text-center text-blue-600 text-base underline-offset-4">Go to Upload Page</div></Link> */}
                </div>
              )
            )
          ) : isRawDocumentsBool ? (
            uploadedData.length > 0 ? (
              <UDocumentsCard uploadedData={uploadedData} />
            ) : (
              <div class="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">There are no Documents loaded yet to the page please Upload a JSON or CSV file.</div>
                <Link to="/"><div class="text-center text-blue-600 text-xl underline-offset-4">Go to Upload Page</div></Link>
              </div>
            )
          ) : isDocumentWordCountBool ? (
            isLoading ? (
              <div class="flex-1 mt-48 text-center">
                <div role="status">
                  <svg aria-hidden="true" class="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) :
              wordCounts.length > 0 ? (
                <WordCountCard wordCounts={wordCounts} />
              ) :
                <div class="flex-1">
                  <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">The documents has not yet been read</div>
                  <Link to="/"><div class="text-center text-gray-600 text-xl underline-offset-4">Please press the Text Pre-Processing Button.</div></Link>
                </div>
          ) :
            <div></div>
          }
        </div >
      </div >
    )
  );
}

export default DocPage;
