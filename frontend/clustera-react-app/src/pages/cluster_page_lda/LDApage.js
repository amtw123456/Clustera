import { SDocumentsCard, ClusteredGeneratedCard, TopicsGeneratedCard, DocumentTopicDistributionCard } from '../../components/docscard.js'
import React, { useEffect, useState, useContext } from "react";
import { Cluster } from '../../modals/modals.js'
import { Link } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.js';
import NavigationBar from '../../components/navbar.js';
import { ImNotification } from "react-icons/im";
import { Tooltip } from 'react-tooltip'



function LDApage() {

  const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { documentsProvider, setDocumentsProvider } = useContext(AppContext);
  const { clustersProvider, setClustersProvider } = useContext(AppContext);

  const [topicsGenerated, setTopicsGenerated] = useState([]);


  const [isLoading, setIsLoading] = useState(false);

  const [isDocumentSummaryBool, setIsDocumentSummaryBool] = useState(true);
  const [isClusteredGeneratedBool, setIsClusteredGeneratedBool] = useState(false);
  const [isDocumentTopicDistributionBool, setIsDocumentTopicDistributionBool] = useState(false);
  const [isTopicsGeneratedBool, setIsTopicsGeneratedBoolBool] = useState(false);
  const [isClassifierBool, setIsClassifierBool] = useState(false);
  const [isVisualizeBool, setIsVisualizeBool] = useState(false);
  const [isExportBool, setIsExportBool] = useState(false);

  const [isCorporaNotClustered, setIsCorporaNotClustered] = useState(true)

  const [noOfClustersInput, setNoOfClustersInput] = useState(1)
  const [vectorizerType, setVectorizerType] = useState('tfidf');
  const [minimumDf, setMinimumDf] = useState(0.1);
  const [maximumDf, setMaximumDf] = useState(10);

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
    // console.log(uploadedData)
    // console.log(preprocessedText)

  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {

    console.log(clustersProvider)

  }, [clustersProvider]);

  const clusterUsingLda = async () => {
    var responseData;
    try {
      const response = await fetch(REACT_APP_BACKEND_API_URL + 'lda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "preprocessed_text": preprocessedText,
          'vectorizer_type': vectorizerType,
          "num_topics": noOfClustersInput
        }),
      });


      responseData = await response.json();


    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);
      setIsCorporaNotClustered(false);

      buildLDAClusterSummary(responseData)
      setClustersProvider(responseData['clusters'])
      setTopicsGenerated(responseData['topics'])
      console.log(responseData['clusters'])
      // console.log(responseData['topics'])

    }
  };

  const buildLDAClusterSummary = async (ldaResults) => {
    ldaResults['document_topic_distribution'].forEach((item, index) => {
      documentsProvider[index].documentTopicDistribution = item
    })
    ldaResults['predicted_clusters'].forEach((item, index) => {
      documentsProvider[index].clusterId = item
    })
    documentsProvider.map((item, index) => (
      documentsProvider[index].topics = ldaResults['topics'][documentsProvider[index].clusterId]
    ))
    // console.log(documentsProvider)
  };

  const createClusters = async (numberOfClusters) => {
    var listOfClusters = []
    for (let i = 0; i < numberOfClusters; i++) {
      listOfClusters.push(new Cluster([], null, i, null))
    }

  }

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

  return (
    <div class="">
      <NavigationBar />

      <div class="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
        <div class="ml-4 pt-4 mb-12 font-bold text-2xl">LDA Clustering</div>

        <div class="mt-4 mx-4 my-5">
          <div class="font-bold text-sm mb-2">Cluster Vectorizer:</div>
          <select class="block px-3 w-52 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={vectorizerType} onChange={handleVectorizerChange}>
            <option value="tfidf-vectorizer">TF-IDF Vectorizer</option>
            <option value="count-vectorizer">Count Vectorizer</option>
          </select>
        </div>


        {/* <a className="my-anchor-element">◕‿‿◕</a>
        <a className="my-anchor-element">◕‿‿◕</a> */}


        <div class="mx-4 my-5">
          <div class="font-bold text-sm mb-2">Number of Clusters:</div>
          <input type="number" placeholder="" class="block px-3 py-2 w-16 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={noOfClustersInput} onInput={(e) => handleInputNoOfClusters(e)} />
        </div>

        <div class="mx-4 my-5 flex-row flex">

          <div>
            <div class="flex flex-row justify-center">
              <a className="min-df-tooltip"><ImNotification class="flex mt-1 text-xs" /></a>
              <div class="flex ml-1 font-bold text-sm mb-2">Min_df:</div>
            </div>
            <input type="number" step="0.01" min="0.01" max="1" placeholder="" class="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={minimumDf} onInput={(e) => handleInputOfMinimumDf(e)} />
            <Tooltip anchorSelect=".min-df-tooltip" place="right">
              <div class='text-xs'>max_df = 0.50 means "ignore terms that appear in more than 50% of the documents</div>
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

            <input type="number" placeholder="" class="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={maximumDf} onInput={(e) => handleInputOfMaximumDf(e)} />
          </div>
        </div>

        <div class="flex justify-center mt-12">
          <button onClick={() => clusterUsingLda()}><Link to="/cluster_page_lda" class="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">Cluster Documents</Link></button>
        </div>
      </div>

      <nav class="py-4 px-4 top-0 left-0 right-0 z-0">
        <div class="flex">
          <div class="ml-80 hidden md:flex flex-1">
            {isDocumentSummaryBool ? (
              <button class="text-black text-base border-x border-t px-10 pt-1" disabled={true}>Documents Summary</button>
            ) : (
              <button class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentSummaryBool')}>Documents Summary</button>
            )}
            {isClusteredGeneratedBool ? (
              <button class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Clusters Generated</button>
            ) : (
              <button class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isClusteredGeneratedBool')}>Clusters Generated</button>
            )}
            {isDocumentTopicDistributionBool ? (
              <button class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Document Topic Distribution</button>
            ) : (
              <button class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentTopicDistributionBool')}>Document Topic Distribution</button>
            )}
            {isTopicsGeneratedBool ? (
              <button class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Topics Generated</button>
            ) : (
              <button class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isTopicsGeneratedBool')}>Topics Generated</button>
            )}
            {isClassifierBool ? (
              <button class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Classifier</button>
            ) : (
              <button class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isClassifierBool')}>Classifier</button>
            )}
            {isVisualizeBool ? (
              <button class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Visualize</button>
            ) : (
              <button class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isVisualizeBool')}>Visualize</button>
            )}
            {isExportBool ? (
              <button class="text-black text-base border-x border-t pr-10 pl-10 pt-1" disabled={true}>Export</button>
            ) : (
              <button class="text-blue-400 text-base border-b px-10 pt-1" onClick={() => toggleBoolUtilisBar('isExportBool')}>Export</button>
            )}

            <a href="/" class="text-blue-400 text-base border-b pr-32 pt-1"></a>
          </div>
        </div>
      </nav >

      {
        isCorporaNotClustered ? (
          <div class="ml-80 flex flex-wrap items-center">
            <div class="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Documents are not yet clustered!</div>
              <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Cluster Documents button in the Sidebar!</div>
            </div>
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
            <TopicsGeneratedCard topicsGenerated={topicsGenerated} />
          </div >
        )
          : isDocumentTopicDistributionBool ? (
            <div class="ml-80 flex flex-row flex-wrap">
              <DocumentTopicDistributionCard summarizedDocuments={documentsProvider} />
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
