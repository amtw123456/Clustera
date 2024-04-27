import React, { useEffect, useState } from 'react';
import WordCloudChart from './wordcloudchart.tsx';
import Scatterplot from "./scatterplot_folder/Scatterplot.tsx";
import { data } from "./scatterplot_folder/data.tsx";


function ExportSection({ summarizedDocuments, noOfClusters, topicsGenerated, clustersGenerated, documentTopicDistributionThreshold, topicsGeneratedLabel }) {

    const [isLoading, setIsLoading] = useState(false);

    const handleExportClick = () => {
        setIsLoading(true);

        setTimeout(() => {
            const jsonBlob = new Blob([JSON.stringify(summarizedDocuments, null, 4)], { type: 'application/json' });

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
        <div class="flex-1 flex-col flex items-center">
            <div class="w-3/5 h-[500px] border border-gray-200 mt-36">
                <div class="flex flex-col items-center">
                    <div class="font-bold text-lg">Export Section</div>
                    <div class="w-full px-3 mt-4 flex flex-row">
                        <div class="w-2/5 h-[225px] overflow-auto">
                            <div class="w-full flex flex-col">
                                <div class="font-bold text-center">Pick Clusters to Download</div>
                                {
                                    Array.from(Array(noOfClusters - 1), (item, index) => (
                                        <div class="flex flex-row">
                                            <input type="checkbox" />
                                            <div class="ml-3 flex-grow">
                                                {
                                                    topicsGeneratedLabel[index] === null ? (
                                                        <div>Cluster {index + 1}: Unlabeled</div>
                                                    ) :
                                                        // <div class="font-bold italic ml-1">{topicsGeneratedLabel[index]}</div>
                                                        <div>Cluster {index + 1}: {topicsGeneratedLabel[index]}</div>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div class="ml-4 w-3/5 h-[225px] overflow-auto">
                            <div class="flex flex-row items-center">
                                <div class="font-bold text-sm mb-2">Document Topic Distribution Threshold:</div>
                                <input type="number" step="0.01" min="0.01" max="1" placeholder="" class="ml-3 block px-3 py-2 w-24 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300" />
                            </div>
                            <div class="flex flex-row">
                                <input type="checkbox" />
                                <div class="ml-3">
                                    Download all Clusters
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleExportClick}>
                            {
                                isLoading ? (
                                    <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                ) :
                                    < div class="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
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