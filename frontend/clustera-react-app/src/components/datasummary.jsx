// Sidebar.jsx
import React, { useEffect, useState, useContext } from 'react';
import PieChart from './piechart.tsx'
import { FaEdit } from "react-icons/fa";
import Popup from 'reactjs-popup';
import { AppContext } from '../providers/AppState.jsx';

function DataSummarySection({ summarizedDocuments, silhouetteScoreGenerated, noOfClusters, topicCoheranceGenerated, topicsGenerated, clustersGenerated, topicsGeneratedLabel, documentCountPerCluster }) {
    const { wordCounts, setWordCounts } = useContext(AppContext);

    const [averageCoheranceScore, setAverageCoheranceScore] = useState(0.00);
    const [numberOfClusteredDocuments, setNumberOfClusteredDocuments] = useState(0.00);
    const [numberOfFilteredDocuments, setNumberOfFilteredDocuments] = useState(0)

    const [reRenderComponent, setReRenderComponent] = useState(false)
    const [newInputLabel, setNewInputLabel] = useState('');

    function setClusterDocumentsCategoryLabel(clusterIndex, documentLabel) {
        summarizedDocuments.map((document, index) => {
            if (clusterIndex === document.clusterId) {
                document.clusterLabel = documentLabel;
            }
        })
    }

    function setClusterCategoryLabel(index, close) {
        // Add your logic here to handle closing or saving data

        topicsGeneratedLabel[index] = newInputLabel
        setNewInputLabel('')
        setReRenderComponent(true)

        close()
    }

    const handleInputLabelChange = (event) => {
        // Update the input value state
        setNewInputLabel(event.target.value);
    };

    useEffect(() => {
        setReRenderComponent(false)
    }, [reRenderComponent]);

    useEffect(() => {
        var temp = 0;
        topicCoheranceGenerated.slice(1).map((coheranceScore, index) => {
            temp += coheranceScore;
        });
        setAverageCoheranceScore(temp / (topicCoheranceGenerated.length - 1))
        temp = 0
        Array.from(Array(noOfClusters - 1), (item, index) => {
            temp += clustersGenerated[index + 1].length;
        });
        setNumberOfClusteredDocuments(temp)
        temp = 0
        documentCountPerCluster.slice(1).map((count, index) => {
            temp += count;
        });
        setNumberOfFilteredDocuments(temp)
    }, []);

    return (
        <div className="flex-col px-2 py-1 flex h-[785px] w-full m-3 rounded-lg bg-gray-100 drop-shadow-lg max-w-[1580px]">
            <div className="flex-row flex h-1/2">
                {/* <div className="ml-3 font-bold italic">Document Topic Distribution:</div> */}
                <div className="p-2 flex flex-col w-1/3 overflow-auto border-grey-300 border rounded-lg mt-3">
                    <div className="font-bold w-full h-[15px] text-center mb-5">Topics Summary</div>
                    <div className="w-full flex flex-col w-[480px]">
                        {topicsGenerated.slice(1).map((topics, index) => (
                            <div className="border-yellow flex flex-col w-full h-[68px] mb-1 overflow-hidden rounded-md text-black-400 mb-1 rounded-md border-teal-400" key={`${index}-${topics}`}>
                                <div className="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                    <div className="flex text-base flex ml-[3px] px-1">Topic {index + 1}:</div>
                                    <div className="overflow-hidden flex flex-wrap">
                                        {
                                            topics.slice(0, 5).map((topic, topicIndex) => (
                                                <div className="flex ml-[3px] px-1 border font-bold text-base text-orange-400 m-1 rounded-md bg-orange-100 border-orange-400" key={`${index}-${topic}`}>{topic}</div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                    <div className="flex text-base flex ml-[3px] px-1 ">Topic Coherence Score: :</div>
                                    <div className='flex text-base italic rounded-md bg-green-100 border-green-400 text-green-400 px-1 border rounded-md'>{topicCoheranceGenerated[index + 1]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ml-2 p-2 flex flex-col w-2/3 border-grey-300 border rounded-lg mt-3">
                    <div className="flex-row flex overflow-hidden">
                        <div className="w-1/2 flex flex-col px-1 overflow-auto">
                            <div className="font-bold h-[15px] text-center mb-5">Cluster Summary</div>
                            <div className="flex flex-col">
                                {Array.from(Array(noOfClusters - 1), (item, index) => (
                                    <div className="border-yellow flex flex-col w-[480px] h-[68px] mb-1 rounded-md text-black-400 rounded-md border-teal-400" key={`${index}-datasummaryuid`}>
                                        <div className="ml-5 flex flex-row flex-wrap italic font-bold text-base items-center">
                                            <div className="flex text-base flex ml-[3px] px-1 ">Cluster {index + 1} Number of documents:</div>
                                            <div className="flex flex-wrap">
                                                <div className="flex ml-[3px] px-1 border font-bold text-base text-purple-400 mt-1 rounded-md bg-purple-100 border-purple-400" >{clustersGenerated[index + 1].length - documentCountPerCluster[index + 1]} / {clustersGenerated[index + 1].length} Documents</div>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex flex-row flex-wrap italic font-bold text-base items-center">
                                            <div className="flex text-base flex ml-[3px] px-1 items-center">Cluster Label: </div>
                                            {
                                                topicsGeneratedLabel[index] === null ? (<>

                                                    < Popup
                                                        contentStyle={{
                                                            borderRadius: "10px",
                                                            overflow: "auto",
                                                            border: "none",
                                                            padding: "0",
                                                            width: '500px',
                                                            height: '150px',
                                                        }}
                                                        trigger=
                                                        {
                                                            < button className="inline-block border text-purple-600 p-0 flex flex-row items-center bg-yellow-100 border-yellow-400 text-yellow-400 rounded-md m-1 px-1 text-yellow-400">
                                                                <div className="font-bold italic ml-1">Input Category name?</div>
                                                                <div onClick={null} className="ml-2 text-purple-400 hover:text-purple-600 hover:cursor-pointer flex">
                                                                    <FaEdit />
                                                                </div>
                                                            </button >
                                                        }
                                                        modal
                                                        nested
                                                    >
                                                        {close => (
                                                            <div style={{ maxHeight: "90vh" }}>
                                                                <div className="px-5 pb-2 flex flex-col items-center">
                                                                    <div className="flex flex-row items-end">
                                                                        <div className="text-3xl ml-7 font-bold inline-block text">
                                                                            <div className="text-xl font-bold inline-block"> Input a category label for Cluster {index + 1}</div>
                                                                        </div>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={newInputLabel}
                                                                        onChange={handleInputLabelChange}
                                                                        placeholder=""
                                                                        className="mt-4 block px-3 py-2 w-96 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300"
                                                                    />
                                                                    <button className="mt-2 inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={() => { setClusterCategoryLabel(index, close); setClusterDocumentsCategoryLabel(index + 1, newInputLabel) }}>Save</button>

                                                                </div>
                                                            </div>
                                                        )}
                                                    </Popup >
                                                </>


                                                ) :
                                                    <div className="font-bold italic ml-1 m-1 px-1 border rounded-md bg-yellow-100 border-yellow-400">
                                                        < Popup
                                                            contentStyle={{
                                                                borderRadius: "10px",
                                                                overflow: "auto",
                                                                border: "none",
                                                                padding: "0",
                                                                width: '500px',
                                                                height: '150px',
                                                            }}
                                                            trigger=
                                                            {
                                                                < button className="inline-block text-purple-600 p-0 flex flex-row items-center text-yellow-400 ">
                                                                    <div className="font-bold italic ml-1">{topicsGeneratedLabel[index]}</div>
                                                                    <div onClick={null} className="ml-2 text-purple-400 hover:text-purple-600 hover:cursor-pointer flex">
                                                                        <FaEdit />
                                                                    </div>
                                                                </button >
                                                            }
                                                            modal
                                                            nested
                                                        >
                                                            {close => (
                                                                <div style={{ maxHeight: "90vh" }}>
                                                                    <div className="px-5 pb-2 flex flex-col items-center">
                                                                        <div className="flex flex-row items-end">
                                                                            <div className="text-3xl ml-7 font-bold inline-block text">
                                                                                <div className="text-xl font-bold inline-block"> Input a category label for Cluster {index + 1}</div>
                                                                            </div>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={newInputLabel}
                                                                            onChange={handleInputLabelChange}
                                                                            placeholder=""
                                                                            className="mt-4 block px-3 py-2 w-96 h-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300"
                                                                        />
                                                                        <button className="mt-2 inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={() => { setClusterCategoryLabel(index, close) }}>Save</button>

                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Popup >
                                                    </div>
                                            }
                                            {/* <div className='flex text-base italic rounded-md bg-green-100 border-green-400 text-green-400 px-1 border rounded-md'>{topicCoheranceGenerated[innerIndex]}</div> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col w-1/2 overflow-x-auto overflow-y-hidden">
                            <div className="font-bold w-full h-[15px] text-center">Clustered Data Donut Chart</div>
                            <div className="w-full flex flex-col">
                                <PieChart clusterData={clustersGenerated} width={500} height={420} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-row flex w-full h-full my-1">

                <div className="flex flex-row w-1/4 justify-start border rounded-lg mr-1">
                    <div className="w-full">
                        <div className="flex flex-col px-4 items-center">
                            <div className="italic font-bold ">Data Summary</div>
                        </div>
                        <div className="flex flex-col px-8">
                            <div className="mt-12 flex-row flex">
                                <div className="font-bold">
                                    Silhouette score:
                                </div>
                                <div className="ml-1 italic">
                                    {silhouetteScoreGenerated}
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex-row flex">
                                    <div className="font-bold">
                                        Coherance Score:
                                    </div>
                                    <div className="ml-1 italic">
                                        {averageCoheranceScore}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex-row flex">
                                    <div className="font-bold">
                                        Number of Unfiltered Documents:
                                    </div>
                                    <div className="ml-1 italic">
                                        {numberOfFilteredDocuments}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex-row flex">
                                    <div className="font-bold">
                                        Number of Unclustered Documents:
                                    </div>
                                    <div className="ml-1 italic">
                                        {clustersGenerated[0].length}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex-row flex">
                                    <div className="font-bold">
                                        Number of Clustered Documents:
                                    </div>
                                    <div className="ml-1 italic">
                                        {numberOfClusteredDocuments}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-3/4 border rounded-lg ml-1">
                    <div className="w-full">
                        <div className="text-center mt-1 font-bold italic">Topics Word Frequency Counts</div>
                        <div className="w-full h-[340px] mt-1 overflow-hidden flex-wrap flex flex-col ">
                            {
                                topicsGenerated.slice(1).map((topics, index) => (
                                    topics.slice(0, 7).map((topic, topicIndex) => (
                                        <div className="ml-[2px] w-[145px] px-1 mt-1 rounded-md" key={`${index}-${topicIndex}-topicwordfreqcount`}>
                                            <div className="flex flex-row items-center">
                                                <div className="font-bold text-sm ">
                                                    {topic}: &nbsp;
                                                </div>
                                                <div className="text-sm">
                                                    {wordCounts.find(item => item[0] === topic)[1]}
                                                </div>
                                            </div>
                                        </div>
                                    ))))
                            }

                        </div>
                    </div>

                </div>


            </div>
        </div >


    );
}


export default DataSummarySection;