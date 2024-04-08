// Sidebar.jsx
import React, { useEffect } from 'react';
import WordCloudChart from './wordcloudchart.tsx';

function VisualizationSection({ summarizedDocuments, noOfClusters, topicCoheranceGenerated, topicsGenerated, clustersGenerated }) {
    const TopicTokenFrequencies = [];

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