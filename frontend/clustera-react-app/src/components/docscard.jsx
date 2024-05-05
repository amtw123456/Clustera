import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../providers/AppState.jsx';
import { AiFillEye } from 'react-icons/ai';
import { IoDocumentSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';

function UDocumentsCard({ uploadedData }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);

    }, []);

    return (
        isComponentLoading ? (
            <div className="flex-1 mt-48 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : (
            uploadedData.map((item, index) => (
                <div className="w-[750px] h-28 my-3 mx-4 h-20 rounded-lg bg-gray-100 drop-shadow-lg" key={index}>
                    <div className="my-2 pb-2 pt-2 px-2">
                        <div>
                            {index + 1 + ". " + item.text.slice(0, 140) + ".......   "}
                            <AiFillEye className="inline-block text-purple-800 text-lg" />
                            {"      "}
                            <Popup
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "none",
                                    padding: "0"
                                }}
                                trigger={<button className="inline-block text-purple-600 p-0">Read Full</button>}
                                modal
                                nested
                            >
                                {close => (
                                    <div>
                                        <div className="border-b px-5 pb-4 border-gray-300 my-4 flex flex-row items-end">
                                            <IoDocumentSharp className="text-3xl pb-1 text-gray-700" /><div className="text-3xl font-bold inline-block"> Document {index + 1} Text</div>
                                        </div>
                                        <div className="overflow-auto p-5 text-justify flex flex-col justify-center" style={{ maxHeight: "50vh" }}>
                                            <div className="pb-5">{item.text}</div>
                                        </div>
                                        <div className="border-t border-gray-300 my-4"></div>
                                        <div className="flex flex-row justify-between items-end b-5 pb-4 px-5">
                                            <button className="inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={close}>Close</button>
                                            <div className="text-sm italic">Length of Document Characters: {item.text.length} </div>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    </div>
                </div>
            ))
        )
    );
}

function PDocumentsCard({ processedData }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);

    }, []);

    return (
        isComponentLoading ? (
            <div className="flex-1 mt-48 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : (
            processedData.map((item, index) => (
                <div className="w-[750px] h-28 my-3 mx-4 h-20 rounded-lg bg-gray-100 drop-shadow-lg" key={index}>
                    <div className="my-2 pb-2 pt-2 px-2">
                        <div>
                            {index + 1 + ". " + item[0].postText.replace(/\s+/g, ', ').slice(0, 140) + ".......   "}
                            <AiFillEye className="inline-block text-purple-800 text-lg" />
                            {"      "}
                            <Popup
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "none",
                                    padding: "0"
                                }}
                                trigger={<button className="inline-block text-purple-600 p-0">Read Full</button>}
                                modal
                                nested
                            >
                                {close => (
                                    <div>
                                        <div className="border-b px-5 pb-4 border-gray-300 my-4 flex flex-row items-end">
                                            <IoDocumentSharp className="text-3xl pb-1 text-gray-700" /><div className="text-3xl font-bold inline-block"> Document {index + 1} Tokens</div>
                                        </div>
                                        <div className="overflow-auto p-5 text-justify flex flex-col justify-center" style={{ maxHeight: "50vh" }}>
                                            <div className="pb-5">{item[0].postText.replace(/\s+/g, ', ')}</div>
                                        </div>
                                        <div className="border-t border-gray-300 my-4"></div>
                                        <div className="flex flex-row justify-between items-end b-5 pb-4 px-5">
                                            <button className="inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={close}>Close</button>
                                            <div className="flex flex-col justify-right">
                                                <div className="text-sm italic">Number of Tokens: {item[1].postTokens.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    </div>
                </div>
            ))
        )
    );
}

function WordCountCard({ wordCounts }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);

    }, []);

    return (
        isComponentLoading ? (
            <div className="flex-1 mt-48 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : (
            wordCounts.map((item, index) => (
                <div key={index} className="w-[135px] h-8 pt-1 m-3 text-center rounded-lg bg-gray-100 drop-shadow-lg">
                    {item[0].slice(0, 12)} : {item[1]}
                </div>
            ))
        )
    );
}

function SDocumentsCard({ summarizedDocuments, documentTopicDistributionThreshold }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);
        // console.log(summarizedDocuments)
    }, []);

    return (
        isComponentLoading ? (
            <div className="flex-1 mt-48 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : (
            summarizedDocuments.map((item, index) => (
                summarizedDocuments[index].includeToClusterBool ? (
                    <div className="w-[750px] h-28 my-3 mx-4 h-20 rounded-lg bg-gray-100 drop-shadow-lg overflow-hidden" key={`${index}-SDocumentsCard`}>
                        <div className="my-2 pb-2 pt-2 px-2">
                            <div>
                                {index + 1 + ". " + item.uDocument.replace(/\s+/g, ', ').slice(0, 140) + ".......   "}
                                <AiFillEye className="inline-block text-purple-800 text-lg" />
                                {"      "}
                                <Popup
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "none",
                                        padding: "0",
                                    }}
                                    trigger={<button className="inline-block text-purple-600 p-0">Read Full</button>}
                                    modal
                                    nested
                                >
                                    {close => (
                                        <div className="overflow-auto mr-1">
                                            <div style={{ maxHeight: "90vh" }}>
                                                <div className="border-b px-5 pb-4 border-gray-300 my-4 flex flex-col">
                                                    <div className="flex flex-row items-end"><IoDocumentSharp className="text-3xl pb-1 text-gray-700" /><div className="text-3xl font-bold inline-block"> Document {index + 1}</div></div>
                                                    <div className="pl-2 text-lg"> Assigned Cluster: {item.clusterId}</div>
                                                </div>
                                                <div className="overflow-auto h-[220px] px-5 pb-5 text-justify flex flex-col mr-1" style={{ maxHeight: "30vh" }}>
                                                    <div className="text-base mb-3 font-bold inline-block"> Document Text</div>
                                                    <div className="pb-5">{item.uDocument}</div>
                                                </div>
                                                <div className="border-t border-gray-300 my-4"></div>
                                                <div className="overflow-auto h-[150px] px-5 pb-5 text-justify flex flex-col mr-1" style={{ maxHeight: "30vh" }}>
                                                    <div className="text-base mb-3 font-bold inline-block"> Document Tokens</div>
                                                    <div className="pb-5">{item.pDocument}</div>
                                                </div>
                                                <div className="border-t border-gray-300"></div>
                                                <div className="px-5 pt-2">
                                                    <div className="font-bold mb-2 px-1">Topics Related to the Document</div>

                                                    <div className="flex flex-row flex-wrap text-justify justify-start" key={index}>
                                                        {item.topics.map((topic, index) => (
                                                            <div className="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" key={index}>
                                                                <div className="px-3 py-[0.5px]">{topic}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="border-t mt-4 border-gray-300"></div>
                                                <div className="px-5 pt-2 flex flex-col">
                                                    <div className="flex font-bold mb-2 px-2">Document Topic Distribution</div>
                                                    <div className="m-1 flex flex-wrap text-justify" key={index}>
                                                        {
                                                            item.documentTopicDistribution.map((distribution, index) => (
                                                                <div style={{ width: 'calc(20% - 8px)' }} className="flex border font-bold text-yellow-400 m-1 rounded-md bg-yellow-100 border-yellow-400" key={index}>
                                                                    <div className="px-2 py-[0.5px] text-sm">Topic {index + 1}:&nbsp; {(distribution * 100).toString().slice(0, 9) + "%"}</div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-300 my-4"></div>
                                                <div className="flex flex-row justify-between items-end b-5 pb-4 px-5">
                                                    <button className="inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={close}>Close</button>
                                                    <div className="flex flex-col justify-right">
                                                        <div className="text-sm italic">Length of Documents: {item.uDocument.length}</div>
                                                        <div className="text-sm italic pl-7">Number of Tokens: {item.documentTokens.length}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            </div>

                        </div >
                    </div >
                ) : <></>
            ))
        )
    );
}


function ClusteredGeneratedCard({ summarizedDocuments, noOfClusters, clustersGenerated, topicsGenerated, documentTopicDistributionThreshold, topicsGeneratedLabel, documentCountPerCluster }) {
    const { includeClusterProvider, setIncludeClusterProvider } = useContext(AppContext);
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);
        // Array.from(Array(noOfClusters - 1), (item, index) => (
        //     clustersGenerated[index + 1].map((value, innerIndex) => {
        //         if (summarizedDocuments[value].includeToClusterBool) {
        //         }
        //     })

    }, []);

    useEffect(() => {
        console.log(includeClusterProvider)
    }, [includeClusterProvider]);

    const handleincludeClusterProviderChane = (index) => {
        const newCheckboxes = [...includeClusterProvider];
        newCheckboxes[index] = !newCheckboxes[index];
        setIncludeClusterProvider(newCheckboxes);
    };

    return (
        isComponentLoading ? (
            <div className="flex-1 mt-48 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : (
            Array.from(Array(noOfClusters - 1), (item, index) => (


                includeClusterProvider[index] ? (

                    <div className="w-[475px] h-72 m-3 rounded-lg bg-gray-100 drop-shadow-lg overflow-hidden" >
                        <div className="w-auto rounded-r-lg mt-2">
                            <div className="px-2 text-lg ml-1 flex justify-left font-bold">
                                {
                                    topicsGeneratedLabel[index] === null ? (
                                        <div>Cluster Label: Unlabeled </div>
                                    ) :
                                        // <div className="font-bold italic ml-1">{topicsGeneratedLabel[index]}</div>
                                        <div>Cluster Label: {topicsGeneratedLabel[index]}</div>
                                }
                            </div>
                            <div className="px-2 text-gray-700 text-sm ml-1 flex justify-left italic">
                                {"Cluster No: " + (index + 1)}
                            </div>
                            <div className="px-2 text-gray-700 text-sm ml-1 flex justify-left italic">
                                No. of Documents in Cluster: {clustersGenerated[index + 1].length - documentCountPerCluster[index + 1]} / {clustersGenerated[index + 1].length}
                            </div>
                            <div className="px-2 text-gray-700 text-sm ml-1 flex justify-left italic">
                                No. of Documents filtered: {documentCountPerCluster[index + 1]}  / {clustersGenerated[index + 1].length}
                            </div>
                            <div className="border-t my-2 border-gray-300"></div>
                            <div className="flex px-2 text-base text-gray-800 ml-1 mb-1 flex justify-left font-bold">
                                {"Top 7 Terms:"}
                            </div>
                            <div className="px-2 flex flex-row flex-wrap text-justify justify-start items-center">
                                {topicsGenerated[index + 1].slice(0, 12).map((topic, index) => (
                                    <div className="flex border text-base font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400">
                                        <div className="px-3 py-[0.5px]">{topic}</div>
                                    </div>
                                ))}
                                <div className="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400">
                                    <div className="px-3 py-[0.5px]">+ {topicsGenerated[index + 1].length - 12}</div>
                                </div>
                            </div>
                        </div>

                        < div className="flex ml-3 justify-center mt-3 items-center" >
                            < AiFillEye className="inline-block text-purple-800 text-lg" />

                            < Popup
                                contentStyle={{
                                    borderRadius: "10px",
                                    overflow: "auto",
                                    border: "none",
                                    padding: "0",
                                    width: '1800px',
                                    height: '800px',
                                    margin: "50px",
                                }}
                                trigger={< button className="inline-block text-purple-600 p-0" >View Cluster Information</button >}
                                modal
                                nested
                            >
                                {close => (
                                    <div style={{ maxHeight: "90vh" }}>
                                        <div className="border-b px-5 pb-4 border-gray-300 my-4 flex flex-col ">
                                            <div className="flex flex-row items-end">
                                                <div className="text-3xl ml-7 font-bold inline-block">
                                                    <div className="text-xl font-bold inline-block"> Cluster {index + 1} documents</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="overflow-auto mr-3 h-[450px] px-5 pb-5 text-justify flex flex-row flex-wrap justify ml-5 drop-shadow-lg" style={{ maxHeight: "50vh" }}>
                                            {clustersGenerated[index + 1].map((value, innerIndex) => (
                                                summarizedDocuments[value].includeToClusterBool ? (
                                                    <div className="overflow-hidden mx-2 px-2 py-2 mb-5 flex flex-row rounded-lg flex-wrap h-48 border-2 w-[410px] h-12">
                                                        <div key={innerIndex}>
                                                            <div className="font-bold">Document Number: {value + 1} </div>
                                                            {/* <div className="italic">Included to Cluster: {summarizedDocuments[value].includeToClusterBool.toString()} </div> */}
                                                            <div className="italic mb-3">
                                                                {"Cluster Topic Distribution: " + (Math.max(...summarizedDocuments[value].documentTopicDistribution))}
                                                            </div>
                                                            <div>
                                                                {/* {summarizedDocuments[value].documentTopicDistribution} */}
                                                            </div>
                                                            <div className="overflow-auto h-[100px] pr-3" style={{ maxHeight: "80vh" }}>
                                                                {summarizedDocuments[value].uDocument}&nbsp;
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : <></>
                                            ))}
                                        </div>

                                        <div className="border-t border-gray-300" />
                                        <div className="px-5 pt-2">
                                            <div className="font-bold ml-5 mb-2 px-1">Topics of the Cluster</div>
                                            <div className="ml-5 flex flex-row flex-wrap text-justify justify-start" key={index}>
                                                {topicsGenerated[index + 1].map((topic, index) => (
                                                    <div className="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400">
                                                        <div className="px-3 py-[0.5px]">{topic}</div>
                                                    </div>
                                                ))}
                                                {/* <div>
                                                <div className="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" key={index}>
                                                    <div className="px-3 py-[0.5px]">+ {topicsGenerated[index].length - 35}</div>
                                                </div>
                                            </div> */}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-300 my-4"></div>
                                        <div className="flex flex-row justify-between items-end b-5 pb-4 px-5">
                                            <button className="inline-block text-white py-2 ml-6 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={close}>Close</button>
                                            <div className="flex flex-col justify-right">
                                                {/* <div className="text-sm italic">Length of Documents: {item.uDocument.length}</div>
                                            <div className="text-sm italic pl-7">Number of Tokens: {item.documentTokens.length}</div> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Popup >
                        </div >
                    </div >
                ) : <> </>
            ))
        )
    );
}

function TopicsGeneratedCard({ topicsGenerated, topicCoheranceGenerated, topicsGeneratedLabel, summarizedDocuments }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);
    const [reRenderComponent, setReRenderComponent] = useState(false)
    const [newInputLabel, setNewInputLabel] = useState('');

    useEffect(() => {
        setIsComponentLoading(false);

    }, []);

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

    return (
        isComponentLoading ? (
            <div className="flex-1 mt-48 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : (
            topicsGenerated.slice(1).map((listOfTopics, index) => (
                <div key={index} className="h-36 w-full pt-1 m-3 justify-start rounded-lg bg-gray-100 drop-shadow-lg overflow-hidden">
                    <div>
                        <div className="flex flex-row items-center ml-3">
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
                                    < button className="inline-block text-purple-600 p-0" >
                                        <div onClick={null} className="text-purple-400 hover:text-purple-600 hover:cursor-pointer">
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
                                            <button className="mt-2 inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={() => { setClusterCategoryLabel(index, close); setClusterDocumentsCategoryLabel(index + 1, newInputLabel); }}>Save</button>

                                        </div>
                                    </div>
                                )}
                            </Popup >
                            {
                                topicsGeneratedLabel[index] === null ? (
                                    <div className="font-bold italic ml-1">Input Category name</div>
                                ) :
                                    <div className="font-bold italic ml-1">{topicsGeneratedLabel[index]}</div>
                            }
                        </div>
                        <div className="flex flex-row items-center">
                            <div className="ml-3 mb-1 italic">Topics of Cluster {index + 1}</div>
                            <div className="ml-3 mb-1 italic">|</div>
                            <div className="ml-3 mb-1 italic">Coherance Score of Cluster {index + 1} topics: {topicCoheranceGenerated[index + 1]}</div>
                        </div>
                        <div className="border-t border-gray-300 my-1"></div>
                    </div >
                    <div className="ml-2 flex flex-row flex-wrap overflow-auto h-[100px]" style={{ maxHeight: "9vh" }}>
                        {listOfTopics.map((topic, innerIndex) => (
                            <div className="flex h-[28px] border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400">
                                <div className="px-3 py-[0.5px]">{topic}</div>
                            </div>
                        ))}
                    </div>
                </div >
            ))
        )
    );
}

function DocumentTopicDistributionCard({ summarizedDocuments, documentTopicDistributionThreshold }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);


    }, []);

    return (
        isComponentLoading ? (
            <div className="flex-1 mt-48 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="mt-24 inline w-48 h-48 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : (
            summarizedDocuments.map((document, innerIndex) => (
                document.includeToClusterBool ? (
                    <div className="h-36 w-full pt-1 m-3 justify-start rounded-lg bg-gray-100 drop-shadow-lg overflow-hidden" >
                        <div className="ml-3 font-bold italic">Document Topic Distribution:</div>
                        <div className="ml-2 flex flex-row flex-wrap">
                            {
                                document.documentTopicDistribution.map((topicDistribution, innerIndex) => (
                                    Math.max(...document.documentTopicDistribution) === topicDistribution ? (
                                        <div className="flex border font-bold text-teal-400 m-1 rounded-md bg-teal-100 border-teal-400">
                                            <div className="px-3 py-[0.5px] ml-1 ml-[6px]">Topic {innerIndex}: {(topicDistribution * 100).toFixed(4)}%</div>
                                        </div>
                                    ) :
                                        <div className="flex border font-bold text-green-400 m-1 rounded-md bg-green-100 border-green-400">
                                            <div className="px-3 py-[0.5px] ml-[6px]">Topic {innerIndex}: {(topicDistribution * 100).toFixed(4)}% </div>
                                        </div>
                                ))
                            }
                        </div>
                        <div className="ml-3">{document.uDocument.slice(0, 150)}......</div>
                    </div >
                ) : <></>
            ))
        )
    );
}

export {
    PDocumentsCard,
    UDocumentsCard,
    WordCountCard,
    SDocumentsCard,
    ClusteredGeneratedCard,
    TopicsGeneratedCard,
    DocumentTopicDistributionCard
};
