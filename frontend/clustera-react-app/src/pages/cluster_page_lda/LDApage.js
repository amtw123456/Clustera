import { SDocumentsCard, ClusteredGeneratedCard, TopicsGeneratedCard } from '../../components/docscard.js'
import React, { useEffect, useState, useContext } from "react";
import { Cluster } from '../../modals/modals.js'
import { Link } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.js';
import NavigationBar from '../../components/navbar.js';

function LDApage() {

  const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { documentsProvider, setDocumentsProvider } = useContext(AppContext);
  const { clustersProvider, setClustersProvider } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const [isDocumentSummaryBool, setIsDocumentSummaryBool] = useState(true);
  const [isClusteredGeneratedBool, setIsClusteredGeneratedBool] = useState(false);
  const [isDocumentTopicDistributionBool, setIsDocumentTopicDistributionBool] = useState(false);
  const [isTopicsGeneratedBool, setIsTopicsGeneratedBoolBool] = useState(false);
  const [isClassifierBool, setIsClassifierBool] = useState(false);
  const [isVisualizeBool, setIsVisualizeBool] = useState(false);
  const [isExportBool, setIsExportBool] = useState(false);

  const [isCorporaNotClustered, setIsCorporaNotClustered] = useState(true)

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
    try {
      const response = await fetch(REACT_APP_BACKEND_API_URL + 'lda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "preprocessed_text": preprocessedText, "num_topics": 2 }),
      });


      const responseData = await response.json();
      console.log(responseData)
      buildLDAClusterSummary(responseData)
      setClustersProvider(responseData['clusters'])

    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);
      setIsCorporaNotClustered(false);


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
    console.log(documentsProvider)
  };

  const createClusters = async (numberOfClusters) => {
    var listOfClusters = []
    for (let i = 0; i < numberOfClusters; i++) {
      listOfClusters.push(new Cluster([], null, i, null))
    }

  }

  return (
    <div class="">
      <NavigationBar />

      <div class="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
        <div class="ml-4 pt-4 font-bold text-2xl">LDA Clustering</div>
        <ul class="mt-12">
          {/* <li><Link to="/" class="block py-2 px-6 text-black hover:bg-gray-300">Upload</Link></li> */}
          {/* <li><Link to="/cluster_page_lsa" class="block py-2 px-5 text-black hover:bg-gray-300">Cluster Using LSA</Link></li> */}
          <li onClick={() => clusterUsingLda()}><Link to="/cluster_page_lda" class="block py-2 px-5 text-black hover:bg-gray-300">Cluster Documents</Link></li>
        </ul>
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
      <div class="ml-80 flex flex-wrap items-center">
        {
          isCorporaNotClustered ? (
            <div class="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Documents are not yet clustered!</div>
              <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Cluster Documents button in the Sidebar!</div>
            </div>
          ) : isDocumentSummaryBool ? (
            <SDocumentsCard summarizedDocuments={documentsProvider} />
          ) : isClusteredGeneratedBool ? (
            <ClusteredGeneratedCard summarizedDocuments={documentsProvider} />
          ) :
            <div class="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">There are no Summarize Documents loaded yet to the page!</div>
              <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Cluster Documents button in the Sidebar!</div>
            </div>
        }
      </div >
    </div >
  );
}

export default LDApage;
