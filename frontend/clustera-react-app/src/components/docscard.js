import React, { useEffect, useState } from "react";
import { AiFillEye } from 'react-icons/ai';
import { IoDocumentSharp } from "react-icons/io5";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function UDocumentsCard({ uploadedData }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);

    }, []);

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
            uploadedData.map((item, index) => (
                <div className="w-[750px] h-28 my-3 mx-4 h-20 rounded-lg bg-gray-100 drop-shadow-lg" key={index}>
                    <div className="my-2 pb-2 pt-2 px-2">
                        <div>
                            {index + 1 + ". " + item.postText.slice(0, 140) + ".......   "}
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
                                            <div className="pb-5">{item.postText}</div>
                                        </div>
                                        <div className="border-t border-gray-300 my-4"></div>
                                        <div className="flex flex-row justify-between items-end b-5 pb-4 px-5">
                                            <button className="inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={close}>Close</button>
                                            <div className="text-sm italic">Length of Document Characters: {item.postText.length} </div>
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
            wordCounts.map((item, index) => (
                <div key={index} className="w-[135px] h-8 pt-1 m-3 text-center rounded-lg bg-gray-100 drop-shadow-lg">
                    {item[0].slice(0, 12)} : {item[1]}
                </div>
            ))
        )
    );
}

function SDocumentsCard({ summarizedDocuments }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);

    }, []);

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
            summarizedDocuments.map((item, index) => (
                <div className="w-[750px] h-28 my-3 mx-4 h-20 rounded-lg bg-gray-100 drop-shadow-lg" key={index}>
                    <div className="my-2 pb-2 pt-2 px-2">
                        <div>
                            {index + 1 + ". " + item.uDocument.replace(/\s+/g, ', ').slice(0, 140) + ".......   "}
                            <AiFillEye className="inline-block text-purple-800 text-lg" />
                            {"      "}
                            <Popup
                                contentStyle={{
                                    borderRadius: "10px",
                                    overflow: "auto",
                                    border: "none",
                                    padding: "0",
                                }}
                                trigger={<button class="inline-block text-purple-600 p-0">Read Full</button>}
                                modal
                                nested
                            >
                                {close => (
                                    <div style={{ maxHeight: "90vh" }}>
                                        <div class="border-b px-5 pb-4 border-gray-300 my-4 flex flex-col">
                                            <div class="flex flex-row items-end"><IoDocumentSharp className="text-3xl pb-1 text-gray-700" /><div className="text-3xl font-bold inline-block"> Document {index + 1}</div></div>
                                            <div class="pl-2 text-lg"> Assigned Cluster: {item.clusterId}</div>
                                        </div>
                                        <div class="overflow-auto h-[220px] px-5 pb-5 text-justify flex flex-col" style={{ maxHeight: "30vh" }}>
                                            <div class="text-base mb-3 font-bold inline-block"> Document Text</div>
                                            <div class="pb-5">{item.uDocument}</div>
                                        </div>
                                        <div className="border-t border-gray-300 my-4"></div>
                                        <div className="overflow-auto h-[150px] px-5 pb-5 text-justify flex flex-col" style={{ maxHeight: "30vh" }}>
                                            <div className="text-base mb-3 font-bold inline-block"> Document Tokens</div>
                                            <div className="pb-5">{item.pDocument}</div>
                                        </div>
                                        <div className="border-t border-gray-300"></div>
                                        <div class="px-5 pt-2">
                                            <div class="font-bold mb-2 px-1">Topics Related to the Document</div>
                                            <div class="flex flex-row flex-wrap text-justify justify-start" key={index}>
                                                {item.topics.map((topic, index) => (
                                                    <div class="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" key={index}>
                                                        <div class="px-3 py-[0.5px]">{topic}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="border-t mt-4 border-gray-300"></div>
                                        <div class="px-5 pt-2 flex flex-col">
                                            <div class="flex font-bold mb-2 px-2">Document Topic Distribution</div>
                                            <div class="m-1 flex flex-wrap text-justify" key={index}>
                                                {/* {item.documentTopicDistribution} */}
                                                {item.documentTopicDistribution.map((distribution, index) => (
                                                    <div style={{ width: 'calc(20% - 8px)' }} class="flex border font-bold text-yellow-400 m-1 rounded-md bg-yellow-100 border-yellow-400" key={index}>
                                                        <div class="px-2 py-[0.5px] text-sm">Topic {index + 1}:&nbsp; {(distribution * 100).toString().slice(0, 9) + "%"}</div>
                                                    </div>
                                                ))}
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
                                )}
                            </Popup>
                        </div>
                    </div >
                </div >
            ))
        )
    );
}


function ClusteredGeneratedCard({ summarizedDocuments, noOfClusters, clustersGenerated, topicsGenerated }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);
        console.log(summarizedDocuments)

    }, []);

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
            Array.from(Array(noOfClusters), (item, index) => (
                <div class="w-[475px] h-60 m-3 rounded-lg bg-gray-100 drop-shadow-lg">
                    <div class="w-auto rounded-r-lg mt-2">
                        <div class="px-2 text-lg ml-1 flex justify-left font-bold">
                            {"Cluster Label: Sports"}
                        </div>
                        <div class="px-2 text-gray-700 text-sm ml-1 flex justify-left italic">
                            {"Cluster No: " + index}
                        </div>
                        <div class="px-2 text-gray-700 text-sm ml-1 flex justify-left italic">
                            {"No. of Documents in Cluster: " + clustersGenerated[index].length}
                        </div>
                        <div className="border-t my-2 border-gray-300"></div>
                        <div class="flex px-2 text-base text-gray-800 ml-1 mb-1 flex justify-left font-bold">
                            {"Top 7 Terms:"}
                        </div>
                        <div class="px-2 flex flex-row flex-wrap text-justify justify-start items-center" key={index}>
                            {topicsGenerated[index].slice(0, 8).map((topic, index) => (
                                <div class="flex border text-base font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" key={index}>
                                    <div class="px-3 py-[0.5px]">{topic}</div>
                                </div>
                            ))}
                            <div class="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" key={index}>
                                <div class="px-3 py-[0.5px]">+ {topicsGenerated[index].length - 8}</div>
                            </div>
                        </div>
                    </div>
                    {/* <div key={index} class="overflow-hidden justify-between px-3 py-2 flex flex-row rounded-l-lg w-[1100px] flex-wrap h-32 max-w-[1100px]">
                        {summarizedDocuments.map((value, innerIndex) => (
                            // Check if value.clusterid is equal to index
                            value.clusterId === index && (
                                <div key={innerIndex}>
                                    {innerIndex}&nbsp;
                                </div>
                            )
                        ))}
                    </div> */}
                    < div class="flex ml-3 justify-center mt-3 items-center" >
                        {/* {index + 1 + ". " + item.uDocument.replace(/\s+/g, ', ').slice(0, 140) + ".......   "} */}
                        < AiFillEye className="inline-block text-purple-800 text-lg" />
                        {"      "}
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
                            trigger={< button class="inline-block text-purple-600 p-0" >View Cluster Information</button >}
                            modal
                            nested
                        >
                            {close => (
                                <div style={{ maxHeight: "90vh" }}>
                                    <div class="border-b px-5 pb-4 border-gray-300 my-4 flex flex-col ">
                                        <div class="flex flex-row items-end">
                                            <div className="text-3xl font-bold inline-block">
                                                <div class="text-xl font-bold inline-block"> Cluster {index} documents</div>
                                            </div>
                                        </div>
                                        {/* <div class="pl-2 text-lg"> Assigned Cluster: {item.clusterId}</div> */}
                                    </div>
                                    <div class="overflow-auto h-[450px] px-5 pb-5 text-justify flex flex-row flex-wrap justify ml-5" style={{ maxHeight: "50vh" }}>
                                        {clustersGenerated[index].map((value, innerIndex) => (
                                            <div key={index} class="overflow-hidden mx-2 px-2 py-2 mb-5 flex flex-row rounded-lg flex-wrap h-48 border-2 w-[410px] h-12">
                                                <div key={innerIndex}>
                                                    <div>
                                                        {Math.max(...summarizedDocuments[value].documentTopicDistribution.slice(0, 10)) + "..........."}
                                                    </div>
                                                    <div class="font-bold">Document Number: {value} </div>
                                                    <div>
                                                        {summarizedDocuments[value].uDocument.slice(0, 200) + "..........."}&nbsp;
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-300" />
                                    <div class="px-5 pt-2">
                                        <div class="font-bold ml-5 mb-2 px-1">Topics of the Cluster</div>
                                        <div class="ml-5 flex flex-row flex-wrap text-justify justify-start" key={index}>
                                            {topicsGenerated[index].map((topic, index) => (
                                                <div class="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" key={index}>
                                                    <div class="px-3 py-[0.5px]">{topic}</div>
                                                </div>
                                            ))}
                                            {/* <div>
                                                <div class="flex border font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" key={index}>
                                                    <div class="px-3 py-[0.5px]">+ {topicsGenerated[index].length - 35}</div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                    {/* <div className="border-t mt-4 border-gray-300"></div>
                                    <div class="px-5 pt-2 flex flex-col">
                                        <div class="flex font-bold mb-2 px-2">Document Topic Distribution</div>
                                        <div class="m-1 flex flex-wrap text-justify" key={index}> */}
                                    {/* {item.documentTopicDistribution} */}
                                    {/* {item.documentTopicDistribution.map((distribution, index) => (
                                                <div style={{ width: 'calc(20% - 8px)' }} class="flex border font-bold text-yellow-400 m-1 rounded-md bg-yellow-100 border-yellow-400" key={index}>
                                                    <div class="px-2 py-[0.5px] text-sm">Topic {index + 1}:&nbsp; {(distribution * 100).toString().slice(0, 9) + "%"}</div>
                                                </div>
                                            ))} */}
                                    {/* </div>
                                    </div> */}

                                    <div className="border-t border-gray-300 my-4"></div>
                                    <div className="flex flex-row justify-between items-end b-5 pb-4 px-5">
                                        <button className="inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={close}>Close</button>
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
            ))


        )
    );
}

function TopicsGeneratedCard({ topics }) {
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
        setIsComponentLoading(false);

    }, []);

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
            topics.map((item, index) => (
                <div key={index} className="w-[135px] h-12 pt-1 m-3 text-center rounded-lg bg-gray-100 drop-shadow-lg">
                    {item}
                </div>
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
    TopicsGeneratedCard
};
