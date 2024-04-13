import { SDocumentsCard, ClusteredGeneratedCard, TopicsGeneratedCard, DocumentTopicDistributionCard } from '../../components/docscard.jsx';
import DataSummarySection from '../../components/datasummary.jsx';
import VisualizationSection from '../../components/visualizesection.jsx';

import React, { useEffect, useState, useContext } from "react";
import { Cluster } from '../../modals/modals.js'
import { Link } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.jsx';
import NavigationBar from '../../components/navbar.jsx';
import { ImNotification } from "react-icons/im";
import { Tooltip } from 'react-tooltip'



function LDApage() {

  const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { documentsProvider, setDocumentsProvider } = useContext(AppContext);
  const { clustersProvider, setClustersProvider } = useContext(AppContext);

  const [topicsGenerated, setTopicsGenerated] = useState([]);
  const [clustersPredicted, setClustersPredicted] = useState([]);
  const [topicCoheranceScores, setTopicCoheranceScores] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isDataSummaryBool, setIsDataSummaryBool] = useState(true);
  const [isDocumentSummaryBool, setIsDocumentSummaryBool] = useState(false);
  const [isClusteredGeneratedBool, setIsClusteredGeneratedBool] = useState(false);
  const [isDocumentTopicDistributionBool, setIsDocumentTopicDistributionBool] = useState(false);
  const [isTopicsGeneratedBool, setIsTopicsGeneratedBoolBool] = useState(false);
  const [isClassifierBool, setIsClassifierBool] = useState(false);
  const [isVisualizeBool, setIsVisualizeBool] = useState(false);
  const [isExportBool, setIsExportBool] = useState(false);

  const [isCorporaNotClustered, setIsCorporaNotClustered] = useState(true)

  // data summary hooks
  const [noOfClustersInput, setNoOfClustersInput] = useState(1)
  const [vectorizerType, setVectorizerType] = useState('tfidf');
  const [minimumDf, setMinimumDf] = useState(1);
  const [maximumDf, setMaximumDf] = useState(2);

  const toggleBoolUtilisBar = (stateName) => {
    // Create an object to map state names to their corresponding setter functions
    const stateSetterMap = {
      isDataSummaryBool: setIsDataSummaryBool,
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

  const clusterUsingLda = async () => {
    var responseData;
    setIsLoading(true);
    try {
      const response = await fetch(REACT_APP_BACKEND_API_URL + 'lda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "preprocessed_text": preprocessedText,
          'vectorizer_type': vectorizerType,
          "num_topics": noOfClustersInput,
          "minimum_df_value": minimumDf,
          "maximum_df_value": maximumDf,
        }),
      });

      responseData = await response.json();

    } catch (error) {
      console.error('Error during text preprocessing:', error);
    } finally {
      setIsCorporaNotClustered(false);

      buildLDAClusterSummary(responseData)
      setClustersProvider(responseData['clusters'])
      setTopicsGenerated(responseData['topics'])
      setTopicCoheranceScores(responseData['topic_coherance_score'])
      setIsLoading(false);
    }
  };

  const buildLDAClusterSummary = async (ldaResults) => {
    setClustersPredicted(ldaResults['predicted_clusters'])
    ldaResults['document_topic_distribution'].forEach((item, index) => {
      documentsProvider[index].documentTopicDistribution = item
    })
    ldaResults['predicted_clusters'].forEach((item, index) => {
      documentsProvider[index].clusterId = item
    })
    documentsProvider.map((item, index) => (
      documentsProvider[index].topics = ldaResults['topics'][documentsProvider[index].clusterId]
    ))
  };

  const handleInputNoOfClusters = (e) => {
    setNoOfClustersInput(parseInt(e.target.value));
  };

  const handleInputOfMaximumDf = (e) => {
    setMaximumDf(parseInt(e.target.value));
  };

  const handleInputOfMinimumDf = (e) => {
    setMinimumDf(parseFloat(e.target.value));
  };

  const handleVectorizerChange = (e) => {
    setVectorizerType(e.target.value);
  };


  const [perplexity, setPerplexity] = useState(20)
  const [angle, setAngle] = useState(0.5);
  const [noOfIterations, setNoOfIterations] = useState(500);
  const [learningRate, setLearningRate] = useState(30);
  const [tsneParameters, setTsneParameters] = useState({
    perplexity: perplexity,
    angle: angle,
    noOfIterations: noOfIterations,
    learningRate: learningRate
  });

  const recomputeTsneValue = async () => {
    updateTsneParameters('perplexity', perplexity)
    updateTsneParameters('angle', angle)
    updateTsneParameters('noOfIterations', noOfIterations)
    updateTsneParameters('learningRate', learningRate)
    console.log("REND")
  }

  const updateTsneParameters = (key, value) => {
    setTsneParameters(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleInputPerplexity = (e) => {
    setPerplexity(parseInt(e.target.value));
  };

  const handleInputAngle = (e) => {
    setAngle(parseFloat(e.target.value));
  };

  const handleInputNoOfIterations = (e) => {
    setNoOfIterations(parseInt(e.target.value));
  };

  const handleInputLearningRate = (e) => {
    setLearningRate(parseInt(e.target.value));
  };

  return (
    <div class="">
      <NavigationBar />

      <div class="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
        <div class="ml-4 pt-4 font-bold text-2xl">LDA Clustering</div>
        {
          isDataSummaryBool ? (
            <>
              <div class="ml-4 italic text-base">Data Summary</div>
              <div class="mt-4 mx-4 my-5">
                <div class="font-bold text-sm mb-2">Cluster Vectorizer:</div>
                <select class="block px-3 w-52 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={vectorizerType} onChange={handleVectorizerChange}>
                  <option value="tfidf-vectorizer">TF-IDF Vectorizer</option>
                  <option value="count-vectorizer">Count Vectorizer</option>
                </select>
              </div>
              <div class="mx-4 my-5 flex-row flex">
                <div>
                  <div class="flex flex-row justify-center">
                    <a className="min-df-tooltip"><ImNotification class="flex mt-1 text-xs" /></a>
                    <div class="flex ml-1 font-bold text-sm mb-2">Min_df:</div>
                  </div>
                  <input type="number" placeholder="" class="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={minimumDf} onInput={(e) => handleInputOfMinimumDf(e)} />
                  <Tooltip anchorSelect=".min-df-tooltip" place="right">
                    <div class='text-xs'>min_df = 5 means "ignore terms that appear in less than 5 documents".</div>
                  </Tooltip>
                </div>
                <div class="ml-12">
                  <div class="flex flex-row justify-center">
                    <a className="max-df-tooltip"><ImNotification class="flex mt-1 text-xs" /></a>
                    <div class="flex ml-1 font-bold text-sm mb-2">Max_df:</div>
                    <Tooltip anchorSelect=".max-df-tooltip" place="right">
                      <div class='text-xs'>max_df = 25 means "ignore terms that appear in more than 25 documents</div>
                    </Tooltip>
                  </div>
                  <input type="number" step="0.01" min="0.01" max="1" placeholder="" class="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={maximumDf} onInput={(e) => handleInputOfMaximumDf(e)} />
                </div>
              </div>
              <div class="mx-4 my-5">
                <div class="font-bold text-sm mb-2">Number of Clusters:</div>
                <input type="number" placeholder="" class="block px-3 py-2 w-16 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={noOfClustersInput} onInput={(e) => handleInputNoOfClusters(e)} />
              </div>
              <div class="flex justify-center mt-12">
                <button onClick={() => clusterUsingLda()}>{ }
                  {
                    isLoading ? (
                      <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                    ) :
                      < div class="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                        Cluster Documents
                      </div>
                  }
                </button>
              </div>
            </>
          ) : isDocumentSummaryBool ? (
            <div class="ml-4 italic text-base">Documents Summary</div>
          ) : isClusteredGeneratedBool ? (
            <div class="ml-4 italic text-base">Clusters Generated</div>
          ) : isDocumentTopicDistributionBool ? (
            <div class="ml-4 italic text-base">Docoument Topic Distribution</div>
          ) : isTopicsGeneratedBool ? (
            <div class="ml-4 italic text-base">Topics Generated</div>
          ) : isClassifierBool ? (
            <div class="ml-4 italic text-base">Classifier</div>
          ) : isVisualizeBool ? (
            <>
              <div class="ml-4 italic text-base">Visualize</div>
              <div class="mx-4 my-5 flex-row flex">
                <div>
                  <div class="flex flex-row justify-center">
                    <a className="min-df-tooltip"><ImNotification class="flex mt-1 text-xs" /></a>
                    <div class="flex ml-1 font-bold text-sm mb-2">Perplexity:</div>
                  </div>
                  <input type="number" placeholder="" min="1" max={documentsProvider.length - 1} class="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={perplexity} onInput={(e) => handleInputPerplexity(e)} />
                  <Tooltip anchorSelect=".min-df-tooltip" place="right">
                    <div class='text-xs'>min_df = 5 means "ignore terms that appear in less than 5 documents".</div>
                  </Tooltip>
                </div>
                <div class="ml-12">
                  <div class="flex flex-row justify-center">
                    <a className="max-df-tooltip"><ImNotification class="flex mt-1 text-xs" /></a>
                    <div class="flex ml-1 font-bold text-sm mb-2">Angle:</div>
                    <Tooltip anchorSelect=".max-df-tooltip" place="right">
                      <div class='text-xs'>max_df = 25 means "ignore terms that appear in more than 25 documents</div>
                    </Tooltip>
                  </div>
                  <input type="number" step="0.01" min="0.01" max="1" placeholder="" class="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={angle} onInput={(e) => handleInputAngle(e)} />
                </div>
              </div>
              <div class="mx-4 my-5">
                <div class="font-bold text-sm mb-2">Number of Iterations:</div>
                <input type="number" placeholder="" min="250" step="25" class="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={noOfIterations} onInput={(e) => handleInputNoOfIterations(e)} />
              </div>
              <div class="mx-4 my-5">
                <div class="font-bold text-sm mb-2">Learning Rate:</div>
                <input type="number" placeholder="" class="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={learningRate} onInput={(e) => handleInputLearningRate(e)} />
              </div>
              <div class="flex justify-center mt-12">
                <button onClick={() => recomputeTsneValue()}>
                  {
                    isLoading ? (
                      <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                    ) :
                      < div class="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                        Cluster Documents
                      </div>
                  }
                </button>
              </div>
            </>

          ) : isExportBool ? (
            <div class="ml-4 italic text-base">Export</div>
          ) : <></>
        }



      </div >

      <nav class="py-4 px-4 top-0 left-0 right-0 z-0">
        <div class="flex">
          <div class="ml-80 hidden md:flex flex-1">
            {
              isDataSummaryBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Data Summary</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isDataSummaryBool')}>Data Summary</button>
              )
            }
            {
              isDocumentSummaryBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Documents Summary</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentSummaryBool')}>Documents Summary</button>
              )
            }
            {
              isClusteredGeneratedBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Clusters Generated</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isClusteredGeneratedBool')}>Clusters Generated</button>
              )
            }
            {
              isDocumentTopicDistributionBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Document Topic Distribution</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentTopicDistributionBool')}>Document Topic Distribution</button>
              )
            }
            {
              isTopicsGeneratedBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Topics Generated</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isTopicsGeneratedBool')}>Topics Generated</button>
              )
            }
            {
              isClassifierBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Classifier</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isClassifierBool')}>Classifier</button>
              )
            }
            {
              isVisualizeBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Visualize</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isVisualizeBool')}>Visualize</button>
              )
            }
            {
              isExportBool ? (
                <button class="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Export</button>
              ) : (
                <button class="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isExportBool')}>Export</button>
              )
            }
            <a class="text-blue-400 text-base border-b pr-32 pt-1"></a>
          </div>
        </div>
      </nav >

      {
        isLoading ? (
          <div class="ml-80 flex flex-wrap items-center">
            <div class="flex-1 mt-48 text-center">
              <div role="status">
                <svg aria-hidden="true" class="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div >
        ) : isCorporaNotClustered ? (
          <div class="ml-80 flex flex-wrap items-center">
            <div class="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Documents are not yet clustered!</div>
              <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Cluster Documents button in the Sidebar!</div>
            </div>
          </div >
        ) : isDataSummaryBool ? (
          <div class="ml-80 flex flex-wrap items-center mx-5">
            <DataSummarySection topicsGenerated={topicsGenerated} noOfClusters={noOfClustersInput} topicCoheranceGenerated={topicCoheranceScores} clustersGenerated={clustersProvider} />
          </div >
        ) : isDocumentSummaryBool ? (
          <div class="ml-80 flex flex-wrap items-center">
            <SDocumentsCard summarizedDocuments={documentsProvider} />
          </div >
        ) : isClusteredGeneratedBool ? (
          <div class="ml-80 flex flex-row flex-wrap">
            <ClusteredGeneratedCard summarizedDocuments={documentsProvider} noOfClusters={noOfClustersInput} topicsGenerated={topicsGenerated} clustersGenerated={clustersProvider} />
          </div >
        ) : isTopicsGeneratedBool ? (
          <div class="ml-80 flex flex-row flex-wrap">
            <TopicsGeneratedCard topicsGenerated={topicsGenerated} topicCoheranceGenerated={topicCoheranceScores} />
          </div >
        ) : isDocumentTopicDistributionBool ? (
          <div class="ml-80 flex flex-row flex-wrap">
            <DocumentTopicDistributionCard summarizedDocuments={documentsProvider} />
          </div >
        ) : isVisualizeBool ? (
          <div class="ml-80 flex flex-row flex-wrap">
            {/* {the key for this part of the code forces the VisualizationSection to rebuild everytime the tsneParameter is Updated} */}
            <VisualizationSection key={JSON.stringify(tsneParameters)} summarizedDocuments={documentsProvider} topicsGenerated={topicsGenerated} clustersGenerated={clustersProvider} clustersPredicted={clustersPredicted} noOfClusters={noOfClustersInput} tsneParameters={tsneParameters} />
          </div >
        ) : (
          < div class="ml-80 flex flex-wrap items-center">
            <div class="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">There are no Summarize Documents loaded yet to the page!</div>
              <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Cluster Documents button in the Sidebar!</div>
            </div>
          </div >
        )
      }
    </div >
  );
}

export default LDApage;

