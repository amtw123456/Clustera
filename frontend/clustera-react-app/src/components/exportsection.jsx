import React, { useEffect, useState } from 'react';

function ExportSection({ summarizedDocuments, noOfClusters, topicsGenerated, clustersGenerated, documentTopicDistributionThreshold, topicsGeneratedLabel }) {

    const [isLoading, setIsLoading] = useState(false);

    const [includeAllClusters, setIncludeAllClusters] = useState(false)
    const [includeDocumentTokens, setIncludeDocumentTokens] = useState(false)
    const [includeClusterLabel, setIncludeClusterLabel] = useState(false)
    const [includeTopicsRelatedToDocument, setIncludeTopicsRelatedToDocument] = useState(false)
    const [includeDocumentTopicDistribution, setIncludeDocumentTopicDistribution] = useState(false)
    const [includePreProcessedText, setIncludePreProcessedText] = useState(false)
    const [checkboxes, setCheckboxes] = useState(Array.from({ length: noOfClusters - 1 }, () => false));
    const [selectedAttributes, setSelectedAttributes] = useState(['uDocument', 'clusterId']);

    const handleDownloadOptionsCheckboxChange = (checkboxName) => {
        const updateSelectedAttributes = (attribute) => {
            setSelectedAttributes(prevState => {
                if (prevState.includes(attribute)) {
                    return prevState.filter(attr => attr !== attribute);
                } else {
                    return [...prevState, attribute];
                }
            });
        };
        switch (checkboxName) {
            case 'includeAllClusters':
                setIncludeAllClusters(prevState => !prevState);
                updateSelectedAttributes('includeAllClusters');
                break;
            case 'includeDocumentTokens':
                setIncludeDocumentTokens(prevState => !prevState);
                updateSelectedAttributes('documentTokens');
                break;
            case 'includeClusterLabel':
                setIncludeClusterLabel(prevState => !prevState);
                updateSelectedAttributes('clusterLabel');
                break;
            case 'includeTopicsRelatedToDocument':
                setIncludeTopicsRelatedToDocument(prevState => !prevState);
                updateSelectedAttributes('topics');
                break;
            case 'includeDocumentTopicDistribution':
                setIncludeDocumentTopicDistribution(prevState => !prevState);
                updateSelectedAttributes('documentTopicDistribution');
                break;
            case 'includePreProcessedText':
                setIncludePreProcessedText(prevState => !prevState);
                updateSelectedAttributes('pDocument');
                break;
            default:
                break;
        }
    };

    const handleIncludeClusterCheckboxChange = (index) => {
        const newCheckboxes = [...checkboxes];
        newCheckboxes[index] = !newCheckboxes[index];
        setCheckboxes(newCheckboxes);
    };

    const handleExportClick = () => {
        setIsLoading(true);

        const dataToExport = []

        summarizedDocuments.map((document, index) => {
            if (document.includeToClusterBool) {
                dataToExport.push(document.exportData(selectedAttributes))
            }
        })

        setTimeout(() => {
            const jsonBlob = new Blob([JSON.stringify(dataToExport, null, 4)], { type: 'application/json' });

            const url = URL.createObjectURL(jsonBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'documents.json';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex-1 flex-col flex items-center">
            <div className="w-3/5 h-[500px] border border-gray-200 mt-36">
                <div className="flex flex-col items-center px-6">
                    <div className="font-bold text-lg">Export Section</div>
                    <div className="w-full px-3 mt-4 flex flex-row border-gray-300 border">
                        <div className="w-2/5 h-[225px] overflow-auto border-gray-300 border-r p-1">
                            <div className="w-full flex flex-col">
                                <div className="font-bold text-center">Pick Clusters to Download</div>
                                {
                                    checkboxes.map((isChecked, index) => (
                                        <div className="flex flex-row">
                                            <input type="checkbox" checked={isChecked} onChange={() => handleIncludeClusterCheckboxChange(index)} />
                                            <div className="ml-3 flex-grow">
                                                {
                                                    topicsGeneratedLabel[index] === null ? (
                                                        <div>Cluster {index + 1}: Unlabeled</div>
                                                    ) :
                                                        // <div className="font-bold italic ml-1">{topicsGeneratedLabel[index]}</div>
                                                        <div>Cluster {index + 1}: {topicsGeneratedLabel[index]}</div>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="ml-4 w-3/5 h-[225px] overflow-auto p-2">
                            <div className="flex flex-col">
                                <div className="flex flex-row items-center">
                                    <div className="font-bold text-sm mb-2">Document Topic Distribution Threshold:</div>
                                    <input type="number" step="0.01" min="0.01" max="1" placeholder="" className="ml-3 block px-3 py-2 w-24 h-8 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" />
                                </div>

                                <div>
                                    <div className="flex flex-row">
                                        <input type="checkbox" checked={includeAllClusters} onChange={() => handleDownloadOptionsCheckboxChange('includeAllClusters')} />
                                        <div className="ml-3">Include All Clusters</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <input type="checkbox" checked={includeDocumentTokens} onChange={() => handleDownloadOptionsCheckboxChange('includeDocumentTokens')} />
                                        <div className="ml-3">Include Document Tokens</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <input type="checkbox" checked={includeClusterLabel} onChange={() => handleDownloadOptionsCheckboxChange('includeClusterLabel')} />
                                        <div className="ml-3">Include Cluster Label</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <input type="checkbox" checked={includeTopicsRelatedToDocument} onChange={() => handleDownloadOptionsCheckboxChange('includeTopicsRelatedToDocument')} />
                                        <div className="ml-3">Include Topics</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <input type="checkbox" checked={includeDocumentTopicDistribution} onChange={() => handleDownloadOptionsCheckboxChange('includeDocumentTopicDistribution')} />
                                        <div className="ml-3">Include Document Topic Distribution</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <input type="checkbox" checked={includePreProcessedText} onChange={() => handleDownloadOptionsCheckboxChange('includePreProcessedText')} />
                                        <div className="ml-3">Include Pre-Processed Text</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleExportClick}>
                            {
                                isLoading ? (
                                    <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                ) :
                                    < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                                        Export Clusters
                                    </div>
                            }
                        </button>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default ExportSection;