// Sidebar.jsx
import React, { useEffect, useState } from 'react';
import WordCloudChart from './wordcloudchart.tsx';
import Scatterplot from "./scatterplot_folder/Scatterplot";
import { data } from "./scatterplot_folder/data";
// import ScatterplotClimateCrisisDemo from './scatterplot_folder/ScatterplotClimateCrisisDemo.tsx'
const HEADER_HEIGHT = 120;
const PADDING = 20;

function VisualizationSection({ summarizedDocuments, noOfClusters, clustersPredicted, topicsGenerated, clustersGenerated }) {

    const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

    const [tsneReducedData, setTsneReducedData] = useState([]);


    const TopicTokenFrequencies = [];
    const document_topic_distribution = [];
    summarizedDocuments.map((item, index) => (
        document_topic_distribution.push(summarizedDocuments[index].documentTopicDistribution)
    ))

    const getTsneData = async () => {
        var responseData;
        try {
            const response = await fetch(REACT_APP_BACKEND_API_URL + 'tsne', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "document_topic_distribution": document_topic_distribution
                }),
            });

            responseData = await response.json();

        } catch (error) {
            console.error('Error during tsne conversion:', error);
            // Handle errors if necessary
        } finally {
            setTsneReducedData(responseData['reduced_data'])

        }
    };

    useEffect(() => {
        getTsneData()
        console.log(clustersPredicted)
    }, []);

    useEffect(() => {
        console.log(tsneReducedData)


    }, [tsneReducedData]);

    Object.keys(topicsGenerated).forEach(key => {
        const tokenFrequencies = {};
        const arrayOfTopics = topicsGenerated[key];
        // console.log(`Cluster Name: ${key}, Values: ${arrayOfTopics.join(', ')}`);
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
        <div class="flex-col px-2 py-1 flex w-full m-3 rounded-lg drop-shadow-lg max-w-[1580px]">
            <Scatterplot
                reducedData={tsneReducedData}
                clusterLabel={clustersPredicted}
                documetsData={summarizedDocuments}
                width={1500}
                height={900 - HEADER_HEIGHT - 2 * PADDING}
            />
            <div class="flex flex-row flex-wrap justify-start mt-3 max-w-[1580px]">
                {
                    TopicTokenFrequencies.map((TokenFrequencies, Index) => (
                        <div class="flex-col flex justify-center mb-10">
                            <WordCloudChart width={750} height={350} TokenFrequencies={TokenFrequencies} />
                            <div class="text-center font-bold">Wordcloud of Cluster: {Index}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default VisualizationSection;