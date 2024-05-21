import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.jsx';
import NavigationBar from '../../components/navbar.jsx';
import LoadingScreen from "../../components/loadingscreen.jsx"
import { PDocumentsCard, UDocumentsCard, WordCountCard } from '../../components/docscard.jsx'


function DocPage() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { wordCounts, setWordCounts } = useContext(AppContext);
  const { documentsProvider, setDocumentsProvider } = useContext(AppContext);
  const { developerMode, setDeveloperMode } = useContext(AppContext);

  const [responseInfo, setResponseInfo] = useState([]);
  const [isPreProcessed, setIsPreProcessed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setPageIsLoading] = useState(true);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);

  // bools
  const [isRawDocumentsBool, setIsRawDocumentsBool] = useState(true);
  const [isPreProcessedBool, setIsPreProcessedBool] = useState(false);
  const [isDocumentWordCountBool, setIsDocumentWordCountBool] = useState(false);

  const [lemmatizationBool, setLemmatizationBool] = useState(false);
  const [stemmingBool, setStemmingBool] = useState(false);

  const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

  const handleDeveloperModeChange = (e) => {
    if (developerMode === "Easy") {
      setDeveloperMode("Expert");
    }
    else {
      setDeveloperMode("Easy");
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'auto';
    setPageIsLoading(false)

  }, [uploadedData]);

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

      const response = await fetch(REACT_APP_BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'documents': uploadedData,
          'enableLemmitization': lemmatizationBool,
          'enableStemming': stemmingBool
        }),
      });
      console.log(JSON.stringify({
        'documents': uploadedData,
        'enableLemmitization': lemmatizationBool,
        'enableStemming': stemmingBool
      }))
      const responseData = await response.json();
      const contentLength = response.headers.get('Content-Length');
      // console.log('Payload size:', contentLength, 'bytes');
      setResponseInfo(responseData.payload);
      setWordCounts(responseData.total_word_counts)
      buildDocumentsFromUpload(responseData.payload)
    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);

    }
  };

  const preprocessTextWithTranslate = async () => {
    setIsPreProcessed((prevValue) => !prevValue);
    setIsPreProcessed(true);
    try {
      setIsLoading(true);

      const response = await fetch(REACT_APP_BACKEND_API_URL + "/tokenizationtranslation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'documents': uploadedData,
          'enableLemmitization': lemmatizationBool,
          'enableStemming': stemmingBool
        }),
      });

      const responseData = await response.json();
      const contentLength = response.headers.get('Content-Length');
      // console.log('Payload size:', contentLength, 'bytes');
      setResponseInfo(responseData.payload);
      setWordCounts(responseData.total_word_counts)
      buildDocumentsFromUpload(responseData.payload)
    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);

    }
  };

  const buildDocumentsFromUpload = async (data) => {
    data.forEach((item, index) => {
      documentsProvider[index].pDocument = item[0].postText
      documentsProvider[index].documentTokens = item[1].postTokens
    })
    var listOfPreProcessedText = [];

    documentsProvider.map((item, index) => (
      listOfPreProcessedText.push(item.pDocument)
    ))

    setPreprocessedText(listOfPreProcessedText)
  };

  const handleLemmizationCheckboxChange = () => {
    setLemmatizationBool(prevState => !prevState)


  };

  const handleStemmingCheckboxChange = () => {
    setStemmingBool(prevState => !prevState)

  };

  return (
    isPageLoading ? <LoadingScreen /> : (
      <div className="" >
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
        <div className="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
          <div className="ml-4 pt-4 font-bold text-2xl">Documents Hub</div>

          <div className="ml-4 italic text-base">Raw Documents</div>
          <>
            {developerMode === "Easy" ? (
              <></>
            ) : (
              <>
                <div className="mt-3 mx-4">
                  <div className="flex flex-row">
                    {/* <a className="cluster-vectorizer-tooltip"><ImNotification className="flex mt-1 text-xs ml-1" /></a> */}
                    {/* <div className="font-bold text-sm ml-1 mb-2">Enable Lemetization:</div>
               */}
                    <label class="flex items-center mr-2">
                      <span class="text-sm font-medium mr-3 font-bold dark:text-gray-400">Enable Lemmatization:</span>
                      <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600 border border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-gray-600 dark:checkbox-gray-500" checked={lemmatizationBool} onClick={() => handleLemmizationCheckboxChange()} />
                    </label>

                  </div>
                </div>

                <div className="mt-3 mx-4">
                  <div className="flex flex-row">
                    {/* <a className="cluster-vectorizer-tooltip"><ImNotification className="flex mt-1 text-xs ml-1" /></a> */}
                    {/* <div className="font-bold text-sm ml-1 mb-2">Enable Lemetization:</div>
               */}
                    <label class="flex items-center mr-2">
                      <span class="text-sm font-medium mr-3 font-bold dark:text-gray-400">Enable Stemming:</span>
                      <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600 border border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-gray-600 dark:checkbox-gray-500" checked={stemmingBool} onClick={() => handleStemmingCheckboxChange()} />
                    </label>

                  </div>
                </div>
              </>

            )}
          </>


          <ul className="mt-12">
            <li>{
              isLoading ? (
                <div>
                  <button disabled type="button" className="block py-2 px-4 text-black flex-1">
                    <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    Loading...
                  </button>
                </div>
              ) : (
                isPreProcessed ? (
                  <span className="block py-2 px-5 text-black bg-gray-300 cursor-not-allowed">Text Pre-Processing</span>
                ) : (
                  <div class="flex">
                    <button className="block py-2 px-4 text-black flex-1 pr-32 hover:bg-gray-300 w-96" onClick={() => preprocessText()}>
                      {"Text Pre-Processing"}
                    </button>
                  </div>
                )
              )
            }</li>
            <li className="flex ">{
              isLoading ? (
                <div>
                  <button disabled type="button" className="block py-2 px-4 text-black flex-1">
                    <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <div>{"Text Pre-Processing With Translate"}</div>
                  </button>
                ) : (
                  <button className="block py-2 px-4 text-black flex-1 pr-32 hover:bg-gray-300" onClick={() => preprocessTextWithTranslate()}>
                    {"Text Pre-Processing With Translate "}
                  </button>
                )
              )
            }</li>
            <li>
              {
                isPreProcessed ? (
                  <Link to="/cluster_page_lsa" className="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LSA</Link>
                ) :
                  <span className="block py-2 px-5 text-black bg-gray-300 cursor-not-allowed">Cluster Using LSA</span>
              }
            </li>
            <li>
              {
                isPreProcessed ? (
                  <Link to="/cluster_page_lda" className="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LDA</Link>
                ) :
                  <span className="block py-2 px-5 text-black bg-gray-300 cursor-not-allowed">Cluster Using LDA</span>
              }
            </li>
          </ul>
        </div>
        <div className="mx-auto w-3/5">
        </div>

        <nav className="py-4 px-4 top-0 left-0 right-0 z-0">
          <div className="flex">
            <div className="ml-80 hidden md:flex flex-1">
              {isRawDocumentsBool ? (
                <button className="text-black text-base border-x border-t pl-12 pr-12 pt-1" disabled={true}>Raw Documents</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-12 pt-1" onClick={() => toggleRawDocumentsBool()}>Raw Documents</button>
              )}
              {isPreProcessedBool ? (
                <button href="#" className="text-black text-base border-x border-t px-12 pt-1" disabled={true}>Pre-Processed Documents</button>
              ) : (
                <button href="#" className="text-blue-400 text-base border-b px-12 pt-1" onClick={() => togglePreProcessedBool()}>Pre-Processed Documents</button>
              )}
              {isDocumentWordCountBool ? (
                <button href="/" className="text-black text-base border-x border-t pr-12 pl-12 pt-1" disabled={true}>Document Word Count</button>
              ) : (
                <button href="/" className="text-blue-400 text-base border-b px-12 pt-1" onClick={() => toggleDocumentWordCountBool()}>Document Word Count</button>
              )}
              <a href="/" className="text-blue-400 text-base border-b pr-96 pt-1"></a>
            </div>
          </div>
        </nav >

        <div className="ml-80 flex flex-wrap items-center">
          {isPreProcessedBool ? (
            isLoading ? (
              <div className="flex-1 mt-48 text-center">
                <div role="status">
                  <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              responseInfo.length > 0 ? (
                <PDocumentsCard processedData={responseInfo} />
              ) : (
                <div className="flex-1">
                  <div className="text-center mt-80 text-gray-600 text-base dark:text-gray-400">Documents have not yet been tokenized!</div>
                  <div className="text-center text-gray-600 text-xl dark:text-gray-400">Please press the Text Pre-Processing Button.</div>
                  {/* <Link to="/"><div className="text-center text-blue-600 text-base underline-offset-4">Go to Upload Page</div></Link> */}
                </div>
              )
            )
          ) : isRawDocumentsBool ? (
            uploadedData.length > 0 ? (
              <UDocumentsCard uploadedData={uploadedData} />
            ) : (
              <div className="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">There are no Documents loaded yet to the page please Upload a JSON or CSV file.</div>
                <Link to="/"><div className="text-center text-blue-600 text-xl underline-offset-4">Go to Upload Page</div></Link>
              </div>
            )
          ) : isDocumentWordCountBool ? (
            isLoading ? (
              <div className="flex-1 mt-48 text-center">
                <div role="status">
                  <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) :
              wordCounts.length > 0 ? (
                <WordCountCard wordCounts={wordCounts} />
              ) :
                <div className="flex-1">
                  <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">The documents has not yet been read</div>
                  <Link to="/"><div className="text-center text-gray-600 text-xl underline-offset-4">Please press the Text Pre-Processing Button.</div></Link>
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
