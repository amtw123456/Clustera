// Sidebar.jsx
import React, { useEffect, useState } from 'react';
import WordCloudChart from './wordcloudchart.tsx';
import Scatterplot from "./scatterplot_folder/Scatterplot";
import { data } from "./scatterplot_folder/data";
// import ScatterplotClimateCrisisDemo from './scatterplot_folder/ScatterplotClimateCrisisDemo.tsx'
const HEADER_HEIGHT = 120;
const PADDING = 20;

function VisualizationSection({ summarizedDocuments, noOfClusters, clustersPredicted, topicsGenerated, clustersGenerated, tsneParameters, documentTopicDistributionThreshold }) {

    const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

    const [isComponentLoading, setIsComponentLoading] = useState(true);
    const [tsneReducedData, setTsneReducedData] = useState([]);

    const [showScatterplotChart, setShowScatterplotChart] = useState(true);
    const [showWordcloudCharts, setShowWordcloudCharts] = useState(false);

    const toggleChartType = () => {
        setShowScatterplotChart(prevState => !prevState);
        setShowWordcloudCharts(prevState => !prevState);
    };

    const TopicTokenFrequencies = [];
    const document_topic_distribution = [];
    summarizedDocuments.map((item, index) => (
        document_topic_distribution.push(summarizedDocuments[index].documentTopicDistribution)
    ))

    const getTsneData = async () => {
        var responseData;
        console.log(tsneParameters)
        try {
            const response = await fetch(REACT_APP_BACKEND_API_URL + 'tsne', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "document_topic_distribution": document_topic_distribution,
                    'perplexity': tsneParameters.perplexity,
                    'angle': tsneParameters.angle,
                    'learningRate': tsneParameters.learningRate,
                    'noOfIterations': tsneParameters.noOfIterations,
                }),
            });

            responseData = await response.json();

        } catch (error) {
            console.error('Error during tsne conversion:', error);
            // Handle errors if necessary
        } finally {
            setTsneReducedData(responseData['reduced_data'])
            setIsComponentLoading(false)

        }
    };

    useEffect(() => {
        getTsneData()

    }, []);

    Object.keys(topicsGenerated).forEach(key => {
        const tokenFrequencies = {};
        const arrayOfTopics = topicsGenerated[key];
        arrayOfTopics.map((value, innerIndex) => (
            tokenFrequencies[value] = 0
        ))

        const arrayOfIndexes = clustersGenerated[key];
        arrayOfIndexes.map((value, innerIndex) => (
            summarizedDocuments[value].documentTokens.map((token, innerInnerIndex) => {
                if (tokenFrequencies.hasOwnProperty(token)) {
                    tokenFrequencies[token] += 1
                }
            })
        ))

        const filteredTokenFrequencies = Object.fromEntries(
            Object.entries(tokenFrequencies)
                .filter(([_, value]) => value !== 0)
        );

        TopicTokenFrequencies.push(filteredTokenFrequencies);
    });

    return (
        isComponentLoading ? (
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
            <div class="flex-col px-2 py-1 flex w-full mx-3 border rounded-lg drop-shadow-lg max-w-[1580px]">
                <div class="flex flex-row justify-start ml-12 mt-2">
                    {
                        showScatterplotChart ? (
                            <button disabled={true} onClick={() => toggleChartType()} class="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow">Scatterplot</button>
                        ) : (
                            <button onClick={() => toggleChartType()} class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow">Scatterplot</button>
                        )
                    }
                    {
                        showWordcloudCharts ? (
                            <button disabled={true} onClick={() => toggleChartType()} class="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow ml-8">Wordcloud</button>
                        ) : (
                            <button onClick={() => toggleChartType()} class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow ml-8">Wordcloud</button>
                        )
                    }
                </div>

                {showScatterplotChart ? (
                    < Scatterplot
                        reducedData={tsneReducedData}
                        clusterLabel={clustersPredicted}
                        documetsData={summarizedDocuments}
                        noOfClusters={noOfClusters}
                        documentTopicDistributionThreshold={documentTopicDistributionThreshold}
                        width={1550}
                        height={920 - HEADER_HEIGHT - 2 * PADDING}
                    />
                ) : <div class="flex flex-row flex-wrap justify-start mt-16 max-w-[1580px]">
                    {
                        TopicTokenFrequencies.map((TokenFrequencies, Index) => (
                            <div class="flex-col flex justify-center mb-10">
                                <WordCloudChart width={750} height={350} TokenFrequencies={TokenFrequencies} />
                                <div class="text-center font-bold">Wordcloud of Cluster: {Index}</div>
                            </div>
                        ))
                    }
                </div>
                }


            </div>
        )
    );
}

export default VisualizationSection;