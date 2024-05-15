import { SDocumentsCard, ClusteredGeneratedCard, TopicsGeneratedCard, DocumentTopicDistributionCard } from '../../components/docscard.jsx';
import DataSummarySection from '../../components/datasummary.jsx';
import ExportSection from '../../components/exportsection.jsx';
import VisualizationSection from '../../components/visualizesection.jsx';
import Classifier from '../../components/classifier.jsx';
import React, { useEffect, useState, useContext } from "react";
import { Cluster } from '../../modals/modals.js'
import { AppContext } from '../../providers/AppState.jsx';
import NavigationBar from '../../components/navbar.jsx';
import { ImNotification } from "react-icons/im";
import { Tooltip } from 'react-tooltip'
import { filter } from 'd3';
// import ExportSection from '../../components/exportsection.jsx';

function LDApage() {

  const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const { documentsProvider, setDocumentsProvider } = useContext(AppContext);
  const { clustersProvider, setClustersProvider } = useContext(AppContext);
  const { classifierModel, setClassifierModel } = useContext(AppContext);
  const { includeClusterProvider, setIncludeClusterProvider } = useContext(AppContext);
  const { includeAllClustersProvider, setIncludeAllClustersProvider } = useContext(AppContext);

  const { vectorizerProvider, setVectorizerProvider } = useContext(AppContext);
  const { ldaModelProvider, setLdaModelProvider } = useContext(AppContext);

  const { developerMode, setDeveloperMode } = useContext(AppContext);

  const [numberOfDocumentsNotIncludedPerCluster, setNumberOfDocumentsNotIncludedPerCluster] = useState([])
  const [silhouettescore, setSilhouettescore] = useState(0);
  const [topicsGenerated, setTopicsGenerated] = useState([]);
  const [topicsGeneratedLabel, setTopicsGeneratedLabel] = useState([]);
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
  const [noOfClustersInputParams, setNoOfClustersInputParams] = useState(1)
  const [vectorizerType, setVectorizerType] = useState('count-vectorizer');
  const [minimumDf, setMinimumDf] = useState(() => {
    if (documentsProvider.length > 1000) {
      return 50;
    } else {
      if (parseInt(documentsProvider.length * 0.05) !== 0) {
        return parseInt(documentsProvider.length * 0.05);
      }
      return 1;

    }
  });
  const [maximumDf, setMaximumDf] = useState(() => {
    return documentsProvider.length
  });

  const [alphaInput, setAlphaInput] = useState(0.05);
  const [betaInput, setBetaInput] = useState(0.05);

  useEffect(() => {
    if (includeClusterProvider.every(item => item === true)) {
      setIncludeAllClustersProvider(true)
    }

  }, [includeClusterProvider]);

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
          // if(key == "")
          if ("isDataSummaryBool" === stateName) {
            if (!(includeClusterProvider.filter(value => value === true).length === 1 || includeClusterProvider.filter(value => value === true).length === 0)) {
              computeClusterSilhoutteScore()
            }
          }

        }
        else {
          stateSetterMap[key](false);
        }
        filterOutDocuments()
      }

    } else {
      console.error(`State ${stateName} does not exist`);
    }

    if (stateName == "isClassifierBool") {
      trainClassifier()
    }
  };

  const handleDeveloperModeChange = (e) => {
    if (developerMode === "Easy") {
      setDeveloperMode("Expert");
    }
    else {
      setDeveloperMode("Easy");
    }
  };

  const computeClusterSilhoutteScore = async () => {
    var responseData;
    const classifierDocumentClusterId = []
    const classifierTopicDistribution = []

    for (let i = 0; i < documentsProvider.length; i++) {
      if (documentsProvider[i].includeToClusterBool && documentsProvider[i].clusterId !== 0) {
        classifierDocumentClusterId.push(documentsProvider[i].clusterId)
        classifierTopicDistribution.push(documentsProvider[i].documentTopicDistribution)
      }
    }
    try {
      const response = await fetch(REACT_APP_BACKEND_API_URL + 'silhouettescore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "lda_document_topic_distribution": classifierTopicDistribution,
          "document_labels": classifierDocumentClusterId,
        }),
      });

      responseData = await response.json();
      setSilhouettescore(responseData['silhoutte_score'])
    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // setSilhouettescore(responseData['silhoutte_score'])
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      // console.log(responseData['silhoutte_score'])
      // setSilhouettescore(responseData['silhoutte_score'])
    }
  }

  const clusterUsingLda = async () => {
    var responseData;
    setIsLoading(true);
    setNoOfClustersInputParams(noOfClustersInput)

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
          "alpha_value": alphaInput,
          "beta_value": betaInput
        }),
      });

      responseData = await response.json();

    } catch (error) {
      console.error('Error during text preprocessing:', error);
    } finally {
      setIsCorporaNotClustered(false);
      buildLDAClusterSummary(responseData)
      setTopicCoheranceScores(responseData['topic_coherance_score'])
      setClustersProvider(responseData['clusters'])
      setTopicsGenerated(responseData['topics'])
      setNumberOfDocumentsNotIncludedPerCluster(Object.values(responseData['clusters']).map(cluster => 0))
      setTopicsGeneratedLabel(Array.from({ length: noOfClustersInput }, () => (null)))
      setIncludeClusterProvider(Array.from({ length: noOfClustersInput }, () => (true)))
      setIsLoading(false);

      setLdaModelProvider(responseData['lda_model'])
      setVectorizerProvider(responseData['vectorizer'])

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
    documentsProvider.map((item, index) => {
      if (documentsProvider[index].clusterId == 0) {
        documentsProvider[index].topics = ["No Topics"]
      }
      else {
        documentsProvider[index].topics = ldaResults['topics'][documentsProvider[index].clusterId]
      }
    })
    documentsProvider.map((item, index) => (
      documentsProvider[index].includeToClusterBool = true
    ))
    documentsProvider.map((item, index) => (
      documentsProvider[index].clusterLabel = "Unlabeled"
    ))
  };

  const handleIncludeClusterCheckboxChange = (index) => {
    const newCheckboxes = [...includeClusterProvider];
    newCheckboxes[index] = !newCheckboxes[index];

    setIncludeClusterProvider(newCheckboxes);

    if (includeAllClustersProvider && !newCheckboxes[index]) {
      setIncludeAllClustersProvider(prevState => !prevState)
    }

  };


  useEffect(() => {
    filterOutDocuments()
    if (!(includeClusterProvider.filter(value => value === true).length === 1 || includeClusterProvider.filter(value => value === true).length === 0)) {
      computeClusterSilhoutteScore()

    }
    else {
      setSilhouettescore(0)
    }


  }, [includeClusterProvider, includeAllClustersProvider]);

  const handleIncludeAllClustersCheckboxChange = () => {

    if (includeAllClustersProvider === false) {
      setIncludeClusterProvider(Array.from({ length: noOfClustersInput }, () => (true)));
    }
    else {
      setIncludeClusterProvider(Array.from({ length: noOfClustersInput }, () => (false)));
    }
    setIncludeAllClustersProvider(!includeAllClustersProvider)

  }

  const handleAlphaInput = (e) => {
    setAlphaInput(parseFloat(e.target.value));
  };

  const handleBetaInput = (e) => {
    setBetaInput(parseFloat(e.target.value));
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

  const [reRenderComponent, setReRenderComponent] = useState(false)

  const [numberOfFilteredDocuments, setNumberOfFilteredDocuments] = useState(0)

  const [documentTopicDistributionThresholdState, setDocumentTopicDistributionThresholdState] = useState(0.00)
  const [documentTopicDistributionThreshold, setDocumentTopicDistributionThreshold] = useState(0.00)

  const [documentNumberOfTokensThresholdState, setDocumentNumberOfTokensThresholdState] = useState(0)
  const [documentNumberOfTokensThreshold, setDocumentNumberOfTokensThreshold] = useState(0)

  const [perplexity, setPerplexity] = useState(() => {
    if (documentsProvider.length > 2000) {
      return 200;
    } else {
      return parseInt(documentsProvider.length * 0.05);
    }
  });

  const [angle, setAngle] = useState(0.5);
  const [noOfIterations, setNoOfIterations] = useState(500);
  const [learningRate, setLearningRate] = useState(30);
  const [tsneParameters, setTsneParameters] = useState({
    perplexity: perplexity,
    angle: angle,
    noOfIterations: noOfIterations,
    learningRate: learningRate,
  });

  const recomputeTsneValue = async () => {
    updateTsneParameters('perplexity', perplexity)
    updateTsneParameters('angle', angle)
    updateTsneParameters('noOfIterations', noOfIterations)
    updateTsneParameters('learningRate', learningRate)
    filterOutDocuments()
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

  const handleInputDocumentTopicDistributionThreshold = (e) => {
    setDocumentTopicDistributionThreshold(parseFloat(e.target.value));
  };

  const handleInputDocumentTokenThreshold = (e) => {
    setDocumentNumberOfTokensThreshold(parseFloat(e.target.value));
  };

  const filterOutDocuments = () => {
    setDocumentTopicDistributionThresholdState(documentTopicDistributionThreshold)
    setDocumentNumberOfTokensThresholdState(documentNumberOfTokensThreshold)

    for (let i = 0; i < documentsProvider.length; i++) {
      if (documentsProvider[i].documentTopicDistribution != null) {
        if (Math.max(...(documentsProvider[i].documentTopicDistribution)) < documentTopicDistributionThreshold || documentsProvider[i].documentTokens.length < documentNumberOfTokensThreshold || !includeClusterProvider[documentsProvider[i].clusterId - 1]) {
          if (documentsProvider[i].includeToClusterBool) {
            documentsProvider[i].includeToClusterBool = false;
            numberOfDocumentsNotIncludedPerCluster[documentsProvider[i].clusterId] += 1;
          }
        }
        else {
          if (!documentsProvider[i].includeToClusterBool) {
            numberOfDocumentsNotIncludedPerCluster[documentsProvider[i].clusterId] -= 1;
            documentsProvider[i].includeToClusterBool = true;
          }
        }
      }
    }
    var temp = 0
    numberOfDocumentsNotIncludedPerCluster.slice(1).map((count, index) => {
      temp += count;
    });
    setNumberOfFilteredDocuments(temp)
  }

  const buildClassifierParamters = () => {
    // filterOutDocuments()
    const classifierDocumentClusterId = []
    const classifierTopicDistribution = []
    const classifierDocumentsText = []
    const classifierDocumentId = []

    for (let i = 0; i < documentsProvider.length; i++) {
      if (documentsProvider[i].includeToClusterBool && documentsProvider[i].clusterId !== 0 && includeClusterProvider[documentsProvider[i].clusterId - 1]) {
        classifierDocumentClusterId.push(documentsProvider[i].clusterId)
        classifierTopicDistribution.push(documentsProvider[i].documentTopicDistribution)
        classifierDocumentsText.push(documentsProvider[i].pDocument)
        classifierDocumentId.push(documentsProvider[i].documentId)
      }
    }
    return [classifierDocumentsText, classifierDocumentClusterId, classifierTopicDistribution, classifierDocumentId]
  }

  const trainClassifier = async () => {
    var responseData;
    setIsLoading(true);
    try {
      const response = await fetch(REACT_APP_BACKEND_API_URL + 'trainldaclassifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "lda_training_data": buildClassifierParamters(),
          'vectorizer_type': vectorizerType,
          "num_topics": noOfClustersInput,
          "minimum_df_value": minimumDf,
          "maximum_df_value": maximumDf,
          "alpha_value": alphaInput,
          "beta_value": betaInput,
          "ldaModel": ldaModelProvider
        }),
      });

      responseData = await response.json();

    } catch (error) {
      console.error('Error during text preprocessing:', error);
    } finally {
      setClassifierModel(responseData['lda_trained_classifier'])
      setLdaModelProvider(responseData['lda_model'])
      setVectorizerProvider(responseData['vectorizer'])
      setIsLoading(false);

    }
  }

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

      <div className="bg-gray-200 mt-16 ml-5 h-[calc(100vh-75px)] w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300 overflow-auto">
        <div className="ml-4 pt-4 font-bold text-2xl">LDA Clustering</div>
        {
          isDataSummaryBool ? (
            <>
              <div className="ml-4 italic text-base">Data Summary</div>

              <div className="mt-3 mx-4">
                <div className="flex flex-row">
                  <a className="cluster-vectorizer-tooltip"><ImNotification className="flex mt-1 text-xs ml-1" /></a>
                  <div className="font-bold text-sm ml-1 mb-2">Cluster Vectorizer:</div>
                </div>
                <Tooltip
                  anchorSelect=".cluster-vectorizer-tooltip"
                  place="right"
                  positionStrategy="fixed"
                  content="Count Vectorizer, Counts the frequency of terms across all documents in a corpus, representing each document as a vector of term counts. While TF-IDF, assigns weights to terms based on their importance within individual documents relative to their occurrence across the entire corpus."
                  style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                />
                <select className="block px-3 w-52 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={vectorizerType} onChange={handleVectorizerChange}>
                  <option value="tfidf-vectorizer">TF-IDF Vectorizer</option>
                  <option value="count-vectorizer">Count Vectorizer</option>
                </select>
              </div>

              <>
                {developerMode === "Expert" ? (
                  <div className="mx-4 my-3 flex-row flex static">
                    <div>
                      <div className="flex flex-row justify-center">
                        <a className="min-df-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="flex ml-1 font-bold text-sm mb-2">Min_df:</div>
                      </div>
                      <input type="number" placeholder="" className="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={minimumDf} onInput={(e) => handleInputOfMinimumDf(e)} />
                      <Tooltip
                        anchorSelect=".min-df-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="min_df = 5 means  ignore terms that appear in less than 5 documents"
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                      />
                    </div>

                    <div className="ml-12">
                      <div className="flex flex-row justify-center">
                        <a className="max-df-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="flex ml-1 font-bold text-sm mb-2">Max_df:</div>
                        <Tooltip
                          anchorSelect=".max-df-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="max_df = 25 means ignore terms that appear in more than 25 documents the. The recommended value for this input field is 50% of the number of documents you have"
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                        />
                      </div>
                      <input type="number" step="1" min="2" max={documentsProvider.length} placeholder="" className="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={maximumDf} onInput={(e) => handleInputOfMaximumDf(e)} />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>


              {
                developerMode === "Expert" ? (
                  <>
                    <div className="mt-3 mx-4">
                      <div className="font-bold text-sm ml-1 mb-2">Latent Dirichlet Allocation Parameters:</div>
                    </div>
                    <div className="mx-4 my-3 flex-row flex">
                      <div>
                        <div className="flex flex-row justify-center">
                          <a className="lda-param-alpha-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                          <div className="flex ml-1 font-bold text-sm mb-2">α (Alpha)</div>
                        </div>
                        <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={alphaInput} onInput={(e) => handleAlphaInput(e)} />
                        <Tooltip anchorSelect=".lda-param-alpha-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="Alpha(α) guides LDA by influencing document compositions: higher values suggest broader topics, lower values suggest focused topics. Adjusting alpha helps LDA capture expected diversity or focus in document topics."
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                        />

                      </div>
                      <div className="ml-12">
                        <div className="flex flex-row justify-center">
                          <a className="lda-param-beta-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                          <div className="flex ml-1 font-bold text-sm mb-2">β (Beta)</div>
                          <Tooltip anchorSelect=".lda-param-beta-tooltip"
                            place="right"
                            positionStrategy="fixed"
                            content="Beta(β) in LDA guides how the model perceives word distributions within topics. Higher beta values imply more uniform word distributions, while lower values suggest more focused word choices. Adjusting beta helps LDA capture the expected diversity or specificity of words within topics."
                            style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                          />
                        </div>
                        <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={betaInput} onInput={(e) => handleBetaInput(e)} />
                      </div>
                    </div>
                  </>
                ) : <></>
              }
              <div className="mx-4 my-3">
                <div className="flex flex-row">
                  <a className="number-cluster-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                  <div className="font-bold text-sm mb-2 ml-1">Number of Clusters:</div>
                  <Tooltip anchorSelect=".number-cluster-tooltip"
                    place="right"
                    positionStrategy="fixed"
                    content="This indicates the number of clusters and topics the LDA model will produce."
                    style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
                <input type="number" placeholder="" className="block px-3 py-2 w-16 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={noOfClustersInput} onInput={(e) => handleInputNoOfClusters(e)} />
              </div>



              <div className="flex justify-center mt-4">
                <button onClick={() => clusterUsingLda()}>
                  {
                    isLoading ? (
                      <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                    ) :
                      < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                        Cluster Documents
                      </div>
                  }
                </button>
              </div>
              {
                developerMode === "Expert" ? (
                  <>
                    <div className="mx-4 mt-5">
                      <div className="flex flex-row">
                        <a className="clusters-include-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-2">Clusters to include:</div>
                        <Tooltip anchorSelect=".clusters-include-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="This indicates the clusters you would like to include for evaluating the data"
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                        />
                      </div>
                      <div className='flex flex-row mt-2 items-center justify-center'>
                        <input
                          type="checkbox"
                          checked={includeAllClustersProvider}
                          onClick={() => handleIncludeAllClustersCheckboxChange()}
                          className=""
                        />
                        <div className='text-xs ml-1'>include all clusters</div>
                      </div>
                    </div>
                    {
                      !isCorporaNotClustered ? (
                        <div className="mx-4 flex flex-row w-6/7 flex-wrap">
                          {
                            Array.from(Array(noOfClustersInputParams), (item, index) => (
                              <div className='flex flex-row mt-2 w-1/3 items-center'>
                                <input
                                  type="checkbox"
                                  checked={includeClusterProvider[index]}
                                  onClick={() => handleIncludeClusterCheckboxChange(index)}
                                  className=""
                                />
                                <div className='text-xs ml-2'>Cluster: {index + 1}</div>
                              </div>
                            ))
                          }
                        </div>
                      ) : <></>
                    }

                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-topic-distribution-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Topic Distribution Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-topic-distribution-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents that are is less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentTopicDistributionThreshold} onInput={(e) => handleInputDocumentTopicDistributionThreshold(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-token-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Tokens Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-token-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents with tokens that are less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="1" min="0" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentNumberOfTokensThreshold} onInput={(e) => handleInputDocumentTokenThreshold(e)} />
                    </div>
                    <div className="flex justify-center mt-6">
                      {
                        !(includeClusterProvider.filter(value => value === true).length === 1 || includeClusterProvider.filter(value => value === true).length === 0) ? (
                          <button onClick={() => { filterOutDocuments(); computeClusterSilhoutteScore() }} disabled={false}  >
                            {
                              < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                                Filter Documents
                              </div>
                            }
                          </button>
                        ) :
                          <button onClick={() => { filterOutDocuments(); computeClusterSilhoutteScore() }} disabled={true}  >
                            {
                              < div className="text-white block py-2 px-5 text-black border-gray-500 text-white px-12 py-2 bg-gray-500 rounded-lg text-sm font-bold hover:bg-gray-500">
                                Filter Documents
                              </div>
                            }
                          </button>
                      }
                    </div>
                  </>
                ) : <></>
              }

              {
                developerMode === "Expert" ? (
                  <>
                    <div className="flex justify-start mt-3 px-4 font-bold">
                      What does this options do(Data Summary)?
                    </div>
                    <div className="px-4 mt-2">
                      <ul className="ml-6 list-disc text-sm">
                        <li className="mt-4">
                          After preprocessing your documents, you may now cluster them and potentially identify the topics associated with each cluster generated.
                        </li>
                        <li className="mt-2">
                          The Cluster vectorizer dropdown form allows you to choose between two vectorizing option to vectorize your documents.
                        </li>
                        <li className="mt-2">
                          The "Minimum Document Frequency" (Min DF) and "Maximum Document Frequency" (Max DF) are parameters used in text mining and natural language processing (NLP) to filter out terms based on their occurrence frequency across a collection of documents (corpus).
                        </li>
                        <li className="mt-2">
                          The input for the number of clusters determines how many clusters the set of documents would generate.
                        </li>
                      </ul>
                    </div>
                  </>
                ) : <></>
              }
              <div className="flex justify-start mt-2 px-4 font-bold">
                What details are provided in this Page(Data Summary)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    Top 5 topics found in each Cluster generated.
                  </li>
                  <li className="mt-2">
                    Word frequency counts of the top topic words in the overall Corpora.
                  </li>
                  <li className="mt-2">
                    Number of Documents in each Cluster and number of unassigned documents.
                  </li>
                  <li className="mt-2">
                    A Donut chart which helps visually displays the document distribution within each cluster
                  </li>
                  <li className="mt-2">
                    Topic Coherence Score which gauges the interpretability of the generated topics, with lower scores indicating higher interpretability.
                  </li>
                  <li className="mt-2">
                    Silhouette Score which serves as an indicator of the overall quality of clusters. A value closer to 1 suggests better clustering quality.
                  </li>
                </ul>
              </div>

            </>
          ) : isDocumentSummaryBool ? (
            <>
              <div className="ml-4 italic text-base">Documents Summary</div>
              {
                developerMode === "Expert" ? (
                  <>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-topic-distribution-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Topic Distribution Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-topic-distribution-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents that are is less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentTopicDistributionThreshold} onInput={(e) => handleInputDocumentTopicDistributionThreshold(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-token-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Tokens Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-token-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents with tokens that are less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="1" min="0" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentNumberOfTokensThreshold} onInput={(e) => handleInputDocumentTokenThreshold(e)} />
                    </div>
                    <div className="flex justify-center mt-6">
                      <button onClick={() => filterOutDocuments()}>{ }
                        {
                          < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Filter Documents
                          </div>
                        }
                      </button>
                    </div>
                    <div className="flex justify-start mt-6 px-4 font-bold">
                      What does this options do (Data Summary)?
                    </div>
                    <div className="px-4 mt-2">
                      <ul className="ml-6 list-disc text-sm">
                        <li className="mt-4">
                          Filter which documents to show, depending on a documents topic distribution.
                        </li>
                        <li className="mt-2">
                          Filter which documents to show, depending on the number of tokens a document has.
                        </li>
                      </ul>
                    </div>
                  </>
                ) : <></>
              }
              <div className="flex justify-start mt-2 px-4 font-bold">
                What details are provided in this Page (Document Summary)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    View the documents that are in the set of documents assuming that the filter options haven't been tampered with.
                  </li>
                  <li className="mt-2">
                    When Read full is clicked on a specific document an overall summary the documents information regardings its text, cluster its associted with, topics associted, document topic distribution, number of tokens, tokens, and length of tokens can be viewed.
                  </li>
                </ul>
              </div>
            </>
          ) : isClusteredGeneratedBool ? (
            <>
              <div className="ml-4 italic text-base">Clusters Generated</div>

              {
                developerMode === "Expert" ? (
                  <>
                    <div className="mx-4">
                      <div className="flex flex-row mt-2">
                        <a className="clusters-include-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-2">Clusters to include:</div>
                        <Tooltip anchorSelect=".clusters-include-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="This indicates the clusters you would like to include for evaluating the data"
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                        />
                      </div>
                      <div className='flex flex-row mt-2 items-center justify-center'>
                        <input
                          type="checkbox"
                          checked={includeAllClustersProvider}
                          onClick={() => handleIncludeAllClustersCheckboxChange()}
                          className=""
                        />
                        <div className='text-xs ml-1'>include all clusters</div>
                      </div>
                    </div>
                    <div className="mx-4 flex flex-row w-6/7 flex-wrap">
                      {
                        Array.from(Array(noOfClustersInputParams), (item, index) => (
                          <div className='flex flex-row mt-2 w-1/3 items-center'>
                            <input
                              type="checkbox"
                              checked={includeClusterProvider[index]}
                              onClick={() => handleIncludeClusterCheckboxChange(index)}
                              className=""
                            />
                            <div className='text-xs ml-2'>Cluster: {index + 1}</div>
                          </div>
                        ))
                      }
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-topic-distribution-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Topic Distribution Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-topic-distribution-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents that are is less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentTopicDistributionThreshold} onInput={(e) => handleInputDocumentTopicDistributionThreshold(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-token-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Tokens Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-token-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents with tokens that are less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="1" min="0" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentNumberOfTokensThreshold} onInput={(e) => handleInputDocumentTokenThreshold(e)} />
                    </div>
                    <div className="flex justify-center mt-6">
                      <button onClick={() => filterOutDocuments()}>{ }
                        {
                          < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Filter Documents
                          </div>
                        }
                      </button>
                    </div>
                    <div className="flex justify-start mt-6 px-4 font-bold">
                      What does this options do (Clusters Generated)?
                    </div>
                    <div className="px-4 mt-2">
                      <ul className="ml-6 list-disc text-sm">
                        <li className="mt-4">
                          Filter which documents to show, depending on a documents topic distribution.
                        </li>
                        <li className="mt-2">
                          Filter which documents to show, depending on the number of tokens a document has.
                        </li>
                      </ul>
                    </div>
                  </>
                ) : <></>
              }
              <div className="flex justify-start mt-2 px-4 font-bold">
                What details are provided in this page (Clusters Generated)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    All of the clusters that have been generated with the top 7 terms associated with it, number of documents in the clusters both filtered and unfiltered, cluster label, cluster Number.
                  </li>
                  <li className="mt-2">
                    When View cluster information is clicked, an information regarding the clusters will be shown which are all the topics associated with the cluster and view the documents associated with the cluster.
                  </li>
                  <li className="mt-2">
                    The documents found inside the clusters will show its top topic distribution with it.
                  </li>
                </ul>
              </div>
            </>
          ) : isDocumentTopicDistributionBool ? (
            <>
              <div className="ml-4 italic text-base">Docoument Topic Distribution</div>
              {
                developerMode === "Expert" ? (
                  <>

                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-topic-distribution-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Topic Distribution Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-topic-distribution-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents that are is less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentTopicDistributionThreshold} onInput={(e) => handleInputDocumentTopicDistributionThreshold(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-token-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Tokens Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-token-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents with tokens that are less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="1" min="0" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentNumberOfTokensThreshold} onInput={(e) => handleInputDocumentTokenThreshold(e)} />
                    </div>
                    <div className="flex justify-center mt-6">
                      <button onClick={() => filterOutDocuments()}>{ }
                        {
                          < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Filter Documents
                          </div>
                        }
                      </button>
                    </div>
                    <div className="flex justify-start mt-6 px-4 font-bold">
                      What does this options do (Document Topic Distribution)?
                    </div>
                    <div className="px-4 mt-2">
                      <ul className="ml-6 list-disc text-sm">
                        <li className="mt-4">
                          Filter which documents to show, depending on a documents topic distribution.
                        </li>
                        <li className="mt-2">
                          Filter which documents to show, depending on the number of tokens a document has.
                        </li>
                      </ul>
                    </div>
                  </>
                ) : <></>
              }
              <div className="flex justify-start mt-2 px-4 font-bold">
                What details are provided in this Page (Document Topic Distribution)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    All of the documents topic distribution with the top topic distribution being highlighted with the color teal.
                  </li>
                </ul>
              </div>
            </>
          ) : isTopicsGeneratedBool ? (
            <>
              <div className="ml-4 italic text-base">Topics Generated</div>
              {/* <div className="mx-4 mt-6 my-5 flex-row flex">
                <div className="italic">No Options for this section</div>
              </div> */}
              <div className="flex justify-start mt-2 px-4 font-bold">
                What does this options do (Topics Generated)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    Edit a clusters category label by clicking on the edit icon beside the "Input Category name".
                  </li>
                </ul>
              </div>
              <div className="flex justify-start mt-6 px-4 font-bold">
                What details are provided in this Page(Topics Generated)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    The umass coherance score of the topics generated for each cluster when a umass score is closer to 0 it means it is more interpretable.
                  </li>
                  <li className="mt-2">
                    All topics associated with a cluster the maximum number of topics you can view is around 47 topics.
                  </li>
                </ul>
              </div>
            </>
          ) : isClassifierBool ? (
            <>
              <div className="ml-4 italic text-base">Classifier</div>
              {
                developerMode === "Expert" ? (
                  <>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-topic-distribution-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Topic Distribution Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-topic-distribution-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents that are is less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentTopicDistributionThreshold} onInput={(e) => handleInputDocumentTopicDistributionThreshold(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-token-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Tokens Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-token-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents with tokens that are less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="1" min="0" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentNumberOfTokensThreshold} onInput={(e) => handleInputDocumentTokenThreshold(e)} />
                    </div>
                    <div className="flex justify-center mt-6 mb-3">
                      <button onClick={() => filterOutDocuments()}>
                        {
                          < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Filter Documents
                          </div>
                        }
                      </button>
                    </div>
                    <div className="mx-4">
                      <div className="flex flex-row">
                        <a className="clusters-include-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-2">Clusters to include:</div>
                        <Tooltip anchorSelect=".clusters-include-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="This indicates the clusters you would like to include for training the classifier"
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                        />
                      </div>
                      <div className='flex flex-row mt-2 items-center justify-center'>
                        <input
                          type="checkbox"
                          checked={includeAllClustersProvider}
                          onClick={() => handleIncludeAllClustersCheckboxChange()}
                          className=""
                        />
                        <div className='text-xs ml-1'>include all clusters</div>
                      </div>
                    </div>

                    <div className="mx-4 flex flex-row w-6/7 flex-wrap">
                      {
                        Array.from(Array(noOfClustersInputParams), (item, index) => (
                          <div className='flex flex-row mt-2 w-1/3 items-center'>
                            <input
                              type="checkbox"
                              checked={includeClusterProvider[index]}
                              onClick={() => handleIncludeClusterCheckboxChange(index)}
                              className=""
                            />
                            <div className='text-xs ml-2'>Cluster: {index + 1}</div>
                          </div>
                        ))
                      }
                    </div>

                    <div className="flex justify-center mt-6">
                      {
                        includeClusterProvider.every(item => item === false) ? (
                          <button onClick={() => trainClassifier()} disabled={true} >
                            {
                              isLoading ? (
                                <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                              ) :
                                < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-gray-500 rounded-lg text-sm font-bold hover:bg-gray-500">
                                  Train Classifier
                                </div>
                            }

                          </button>) : (
                          <button onClick={() => trainClassifier()} disabled={false} >
                            {
                              isLoading ? (
                                <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                              ) :
                                < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                                  Train Classifier
                                </div>
                            }

                          </button>
                        )
                      }
                    </div>
                    <div className="flex justify-start mt-6 px-4 font-bold">
                      What does this options do (Classifier)?
                    </div>
                    <div className="px-4 mt-2">
                      <ul className="ml-6 list-disc text-sm">
                        <li className="mt-4">
                          Filter which documents will be used to train the classifier, depending on a documents topic distribution.
                        </li>
                        <li className="mt-2">
                          Filter which documents will be used to train the classifier, depending on the number of tokens a document has.
                        </li>
                        <li className="mt-2">
                          When you have filtered documents that you want to exclude and are satisfied with what you have filtered, you can press the "Train Classifier" to retrain the classifier.
                        </li>
                      </ul>
                    </div>
                  </>
                ) : <></>
              }
              <div className="flex justify-start mt-6 px-4 font-bold">
                What does this page do (Classifier)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    A user can input a text to the textbox which will be the container when the user will classify which the document belongs to.
                  </li>
                  <li className="mt-2">
                    The Classify Documents button will classify a document to which cluster it might belong to.
                  </li>
                </ul>
              </div>
              <div className="flex justify-start mt-2 px-4 font-bold">
                What details are provided in this Page(Document Summary)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    See each cluster with the top 7 of the topics associated and number of documents which were used to train a sub classifier.
                  </li>
                  <li className="mt-2">
                    When a document is classified a probability prediciton with all the possible clusters will be filled which can be considered as a document topic distribution.
                  </li>
                </ul>
              </div>
            </>
          ) : isVisualizeBool ? (
            <>
              {
                developerMode === "Expert" ? (
                  <>
                    <div className="ml-4 italic text-base">Visualize</div>
                    <div className="mx-4 mt-5">
                      <div className="flex flex-row">
                        <a className="clusters-include-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Clusters to include:</div>
                        <Tooltip anchorSelect=".clusters-include-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="This indicates the clusters you would like to include for displaying the clusters in the scatterplot graph"
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                        />
                      </div>
                      <div className='flex flex-row mt-2 items-center justify-center'>
                        <input
                          type="checkbox"
                          checked={includeAllClustersProvider}
                          onClick={() => handleIncludeAllClustersCheckboxChange()}
                          className=""
                        />
                        <div className='text-xs ml-1'>include all clusters</div>
                      </div>
                    </div>

                    <div className="mx-4 flex flex-row w-6/7 flex-wrap">
                      {
                        Array.from(Array(noOfClustersInputParams), (item, index) => (
                          <div className='flex flex-row mt-2 w-1/3 items-center'>
                            <input
                              type="checkbox"
                              checked={includeClusterProvider[index]}
                              onClick={() => handleIncludeClusterCheckboxChange(index)}
                              className=""
                            />
                            <div className='text-xs ml-2'>Cluster: {index + 1}</div>
                          </div>
                        ))
                      }
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-topic-distribution-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Topic Distribution Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-topic-distribution-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents that are is less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentTopicDistributionThreshold} onInput={(e) => handleInputDocumentTopicDistributionThreshold(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="document-token-threshold-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Document Tokens Threshold:</div>
                      </div>
                      <Tooltip anchorSelect=".document-token-threshold-tooltip"
                        place="right"
                        positionStrategy="fixed"
                        content="This would filter out documents with tokens that are less than the indicated number."
                        style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
                      />
                      <input type="number" step="1" min="0" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentNumberOfTokensThreshold} onInput={(e) => handleInputDocumentTokenThreshold(e)} />
                    </div>
                    <div className="flex justify-center mt-6 mb-3">
                      <button onClick={() => filterOutDocuments()}>
                        {
                          < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Filter Documents
                          </div>
                        }
                      </button>
                    </div>
                    <div className="mx-4 my-3 flex-row flex">
                      <div>
                        <div className="flex flex-row justify-center">
                          <a className="perplexity-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                          <div className="flex ml-1 font-bold text-sm mb-2">Perplexity:</div>
                          <Tooltip anchorSelect=".perplexity-tooltip"
                            place="right"
                            positionStrategy="fixed"
                            content="Perplexity in t-SNE controls the number of close neighbors each point considers during the dimensionality reduction process. A higher perplexity value generally results in considering more neighbors, leading to a smoother and more global view of the data. Conversely, a lower perplexity value focuses on fewer neighbors, potentially revealing more local structure in the data. Adjusting perplexity requires balancing between capturing local and global structures in the resulting visualization."
                            style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                          />
                        </div>
                        <input type="number" placeholder="" min="1" max={documentsProvider.length - 1} className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={perplexity} onInput={(e) => handleInputPerplexity(e)} />

                      </div>
                      <div className="ml-12">
                        <div className="flex flex-row justify-center">
                          <a className="angle-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                          <div className="flex ml-1 font-bold text-sm mb-2">Angle:</div>
                          <Tooltip anchorSelect=".angle-tooltip"
                            place="right"
                            positionStrategy="fixed"
                            content="Angle parameter influences how t-SNE approximates the distances between points in high-dimensional space. A larger angle allows for faster computation but may sacrifice accuracy, while a smaller angle ensures more accurate results but requires more computational time. Adjusting the angle parameter requires balancing between the computational efficiency and the quality of the resulting visualization."
                            style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                          />
                        </div>
                        <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-20 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={angle} onInput={(e) => handleInputAngle(e)} />
                      </div>
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="number_iterations-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Number of Iterations:</div>
                        <Tooltip anchorSelect=".number_iterations-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="Number of iterations influences how thoroughly t-SNE adjusts the positions of data points in the visualization space to find an optimal arrangement. More iterations generally result in a more refined and accurate representation of the data, but they also require more computational time. The choice of the number of iterations depends on the desired balance between the quality of the visualization and the computational resources available."
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                        />
                      </div>
                      <input type="number" placeholder="" min="250" step="25" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={noOfIterations} onInput={(e) => handleInputNoOfIterations(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="flex flex-row">
                        <a className="learning-rate-tooltip"><ImNotification className="flex mt-1 text-xs" /></a>
                        <div className="font-bold text-sm mb-2 ml-1">Learning Rate:</div>
                        <Tooltip anchorSelect=".learning-rate-tooltip"
                          place="right"
                          positionStrategy="fixed"
                          content="Learning rate affects how quickly or slowly t-SNE adjusts the positions of data points in the embedding space. A higher learning rate allows for faster convergence but may risk overshooting the optimal solution, leading to instability or poor quality embeddings. Conversely, a lower learning rate results in more cautious adjustments, potentially leading to better-quality embeddings but requiring more iterations to converge. Adjusting the learning rate is crucial for finding the right balance between convergence speed and the quality of the final visualization."
                          style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', width: "600px" }}
                        />
                      </div>
                      <input type="number" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={learningRate} onInput={(e) => handleInputLearningRate(e)} />
                    </div>
                    <div className="flex justify-center mt-6">
                      <button onClick={() => recomputeTsneValue()}>
                        {
                          isLoading ? (
                            <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                          ) :
                            < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                              Recompute Scatterplot Values
                            </div>
                        }
                      </button>
                    </div>
                    <div className="flex justify-start mt-6 px-4 font-bold">
                      What does this options do(Data Summary)?
                    </div>
                    <div className="px-4 mt-2">
                      <ul className="ml-6 list-disc text-sm">
                        <li className="mt-4">
                          Allows you to set the perplexity of the scatterplot graph.
                        </li>
                        <li className="mt-2">
                          Allows you to set the angle of the scatterplot graph.
                        </li>
                        <li className="mt-2">
                          Allows you to set the number of iterations when generating the scatterplot graph.
                        </li>
                        <li className="mt-2">
                          Allows you to set the learning rate when generating the scatterplot graph.
                        </li>
                        <li className="mt-2">
                          Allows you to filter which documents to show in the scatterplot graph, depending on a documents topic distribution.
                        </li>
                        <li className="mt-2">
                          Allows you to filter which documents to show in the scatterplot graph, depending on the number of tokens a document has.
                        </li>
                      </ul>
                    </div>
                  </>
                ) : <></>
              }
              <div className="flex justify-start mt-2 px-4 font-bold">
                What details are provided in this Page(Document Summary)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    The following graph is a t-SNE graph where the points in the graph are document topic distributions of the documents which were reduced to a 2-dimensional form using t-SNE(t-distributed stochastic neighbor embedding).
                  </li>
                  <li className="mt-2">
                    Allows the user to see the overall quality of the genererated clusters by seeing.
                  </li>
                  <li className="mt-2">
                    Allows the user to see which documents might be closely related to other clusters due to its document topic distribution.
                  </li>
                  <li className="mt-2">
                    Allows the user to see the word graph and how much weight each word is for each topic generated.
                  </li>
                </ul>
              </div>
            </>

          ) : isExportBool ? (
            <>
              {
                developerMode === "Expert" ? (
                  <>
                    <div className="ml-4 italic text-base">Export</div>
                    <div className="mx-4 my-3">
                      <div className="font-bold text-sm mb-2">Document Topic Distribution Threshold:</div>
                      <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentTopicDistributionThreshold} onInput={(e) => handleInputDocumentTopicDistributionThreshold(e)} />
                    </div>
                    <div className="mx-4 my-3">
                      <div className="font-bold text-sm mb-2">Document Tokens Threshold:</div>
                      <input type="number" step="1" min="0" placeholder="" className="block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" value={documentNumberOfTokensThreshold} onInput={(e) => handleInputDocumentTokenThreshold(e)} />
                    </div>
                    <div className="flex justify-center mt-6">
                      <button onClick={() => filterOutDocuments()}>{ }
                        {
                          < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Filter Documents
                          </div>
                        }
                      </button>
                    </div>
                  </>
                ) : <></>
              }
              <div className="flex justify-start mt-6 px-4 font-bold">
                What does this options do(Data Summary)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  {
                    developerMode === "Expert" ? (
                      <>
                        <li className="mt-4">
                          Allows you to filter which documents to download, depending on a documents topic distribution.
                        </li>
                        <li className="mt-2">
                          Allows you to filter which documents to download, depending on the number of tokens a document has.
                        </li>
                      </>
                    ) : <></>
                  }
                  <li className="mt-2">
                    The checkboxes allow you to pick which other information the user wants to download along with the documents.
                  </li>
                  <li className="mt-2">
                    The export button lets the user download the Documents of the Clusters generated.
                  </li>
                </ul>
              </div>
              <div className="flex justify-start mt-2 px-4 font-bold">
                What details are provided in this Page(Document Summary)?
              </div>
              <div className="px-4 mt-2">
                <ul className="ml-6 list-disc text-sm">
                  <li className="mt-4">
                    The number of documents per cluster will be included in the download.
                  </li>
                  {/* <li className="mt-2">
                    When Read full is clicked on a specific document an overall summary the documents information regardings its text, cluster its associted with, topics associted, document topic distribution, number of tokens, tokens, and length of tokens can be viewed.
                  </li> */}
                </ul>
              </div>
            </>
          ) : <></>
        }


      </div >

      <nav className="py-4 px-4 top-0 left-0 right-0 z-0">
        <div className="flex">
          <div className="ml-80 hidden md:flex flex-1">
            {
              isDataSummaryBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Data Summary</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isDataSummaryBool')}>Data Summary</button>
              )
            }
            {
              isDocumentSummaryBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Documents Summary</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentSummaryBool')}>Documents Summary</button>
              )
            }
            {
              isClusteredGeneratedBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Clusters Generated</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isClusteredGeneratedBool')}>Clusters Generated</button>
              )
            }
            {
              isDocumentTopicDistributionBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Document Topic Distribution</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isDocumentTopicDistributionBool')}>Document Topic Distribution</button>
              )
            }
            {
              isTopicsGeneratedBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Topics Generated</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isTopicsGeneratedBool')}>Topics Generated</button>
              )
            }
            {
              isClassifierBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Classifier</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isClassifierBool')}>Classifier</button>
              )
            }
            {
              isVisualizeBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Visualize</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isVisualizeBool')}>Visualize</button>
              )
            }
            {
              isExportBool ? (
                <button className="text-black text-base border-x border-t px-8 pt-1" disabled={true}>Export</button>
              ) : (
                <button className="text-blue-400 text-base border-b px-8 pt-1" onClick={() => toggleBoolUtilisBar('isExportBool')}>Export</button>
              )
            }
            <a className="text-blue-400 text-base border-b pr-32 pt-1"></a>
          </div>
        </div>
      </nav >

      {
        isLoading ? (
          <div className="ml-80 flex flex-wrap items-center">
            <div className="flex-1 mt-48 text-center">
              <div role="status">
                <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div >
        ) : isCorporaNotClustered ? (
          <div className="ml-80 flex flex-wrap items-center">
            <div className="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Documents are not yet clustered!</div>
              <div className="text-center text-blue-600 text-xl underline-offset-4">Please press the Cluster Documents button in the Sidebar!</div>
            </div>
          </div >
        ) : isDataSummaryBool ? (
          <div className="ml-80 flex flex-wrap items-center mx-5">
            <DataSummarySection summarizedDocuments={documentsProvider} topicsGenerated={topicsGenerated} silhouetteScoreGenerated={silhouettescore} noOfClusters={noOfClustersInputParams + 1} topicCoheranceGenerated={topicCoheranceScores} clustersGenerated={clustersProvider} topicsGeneratedLabel={topicsGeneratedLabel} documentCountPerCluster={numberOfDocumentsNotIncludedPerCluster} filteredDocumentCount={numberOfFilteredDocuments} />
          </div >
        ) : isDocumentSummaryBool ? (
          <div className="ml-80 flex flex-wrap items-center">
            <SDocumentsCard summarizedDocuments={documentsProvider} documentTopicDistributionThreshold={documentTopicDistributionThresholdState} />
          </div >
        ) : isClusteredGeneratedBool ? (
          <div className="ml-80 flex flex-row flex-wrap">
            <ClusteredGeneratedCard
              summarizedDocuments={documentsProvider}
              noOfClusters={noOfClustersInputParams + 1}
              topicsGenerated={topicsGenerated}
              clustersGenerated={clustersProvider}
              documentTopicDistributionThreshold={documentTopicDistributionThresholdState}
              topicsGeneratedLabel={topicsGeneratedLabel}
              documentCountPerCluster={numberOfDocumentsNotIncludedPerCluster} />
          </div >
        ) : isTopicsGeneratedBool ? (
          <div className="ml-80 flex flex-row flex-wrap">
            <TopicsGeneratedCard topicsGenerated={topicsGenerated} topicCoheranceGenerated={topicCoheranceScores} topicsGeneratedLabel={topicsGeneratedLabel} summarizedDocuments={documentsProvider} />
          </div >
        ) : isDocumentTopicDistributionBool ? (
          <div className="ml-80 flex flex-row flex-wrap">
            <DocumentTopicDistributionCard summarizedDocuments={documentsProvider} documentTopicDistributionThreshold={documentTopicDistributionThresholdState} />
          </div >
        ) : isVisualizeBool ? (
          <div className="ml-80 flex flex-row flex-wrap">
            {/* {the key for this part of the code forces the VisualizationSection to rebuild everytime the tsneParameter is Updated} */}
            <VisualizationSection key={JSON.stringify(tsneParameters)} summarizedDocuments={documentsProvider} topicsGenerated={topicsGenerated} clustersGenerated={clustersProvider} clustersPredicted={clustersPredicted} noOfClusters={noOfClustersInputParams + 1} tsneParameters={tsneParameters} documentTopicDistributionThreshold={documentTopicDistributionThresholdState} topicsGeneratedLabel={topicsGeneratedLabel} />
          </div >
        ) : isClassifierBool ? (
          <div className="ml-80 flex flex-row flex-wrap">
            <Classifier summarizedDocuments={documentsProvider} classifierModel={classifierModel} topicsGenerated={topicsGenerated} topicsGeneratedLabel={topicsGeneratedLabel} clustersGenerated={clustersProvider} documentCountPerCluster={numberOfDocumentsNotIncludedPerCluster} clustersPredicted={clustersPredicted} />
          </div >
        ) : isExportBool ? (
          <div className="ml-80 flex flex-row flex-wrap">
            <ExportSection summarizedDocuments={documentsProvider} topicsGenerated={topicsGenerated} topicsGeneratedLabel={topicsGeneratedLabel} clustersGenerated={clustersProvider} noOfClusters={noOfClustersInputParams + 1} documentCountPerCluster={numberOfDocumentsNotIncludedPerCluster} />
          </div >
        ) :
          < div className="ml-80 flex flex-wrap items-center">
            <div className="flex-1">
              <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">There are no Summarize Documents loaded yet to the page!</div>
              <div className="text-center text-blue-600 text-xl underline-offset-4">Please press the Cluster Documents button in the Sidebar!</div>
            </div>
          </div >
      }
    </div >
  );
}

export default LDApage;

