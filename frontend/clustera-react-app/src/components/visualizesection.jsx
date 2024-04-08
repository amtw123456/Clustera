// Sidebar.jsx
import React, { useEffect } from 'react';
import WordCloudChart from './wordcloudchart.tsx';

function VisualizationSection({ summarizedDocuments, noOfClusters, topicCoheranceGenerated, topicsGenerated, clustersGenerated }) {

    useEffect(() => {
        console.log(clustersGenerated)
    }, []);

    return (
        <div class="flex-col px-2 py-1 flex h-[785px] w-full m-3 rounded-lg bg-gray-100 drop-shadow-lg max-w-[1580px]">
            <div class="flex-row flex w-full h-full my-2">

                <div class="flex flex-row w-1/2 justify-start mt-3">
                    <WordCloudChart width={500} height={250} />
                </div>
                <div class="flex flex-row w-1/2 justify-start mt-3">
                    <WordCloudChart width={500} height={250} />
                </div>
            </div>

        </div>
    );
}


export default VisualizationSection;