import React from 'react';
import { AiFillEye } from 'react-icons/ai';
import { IoDocumentSharp } from "react-icons/io5";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function UDocumentsCard({ index, item }) {
    return (
        <div className="w-[900px] h-28 my-3 mx-4 h-20 rounded-lg bg-gray-100 drop-shadow-lg" key={index}>
            <div className="my-2 pb-2 pt-2 px-2">
                <div>
                    {index + 1 + ". " + item.postText.slice(0, 140) + ".......   "}
                    <AiFillEye className="inline-block text-purple-800 text-lg" />
                    {"      "}
                    <Popup contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        padding: "0"
                    }} trigger={<button className="inline-block text-purple-600 p-0">Read Full</button>} modal nested>
                        {close => (
                            <div>
                                <div class="border-b px-5 pb-4 border-gray-300 my-4 flex flex-row items-end">
                                    <IoDocumentSharp class="text-3xl pb-1 text-gray-700" /><div className="text-3xl font-bold inline-block"> Document {index + 1}</div>
                                </div>
                                <div className="overflow-auto p-5 text-justify flex flex-col justify-center" style={{ maxHeight: "50vh" }}>
                                    <div class="pb-5">{item.postText}</div>
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
    );
}

function PDocumentsCard({ index, item }) {
    // Your implementation for DocumentsCardV2 goes here
    return (
        <div className="w-[900px] h-28 my-3 mx-4 h-20 rounded-lg bg-gray-100 drop-shadow-lg" key={index}>
            <div className="my-2 pb-2 pt-2 px-2">
                <div>
                    {index + 1 + ". " + item[0].postText.slice(0, 140) + ".......   "}
                    <AiFillEye className="inline-block text-purple-800 text-lg" />
                    {"      "}
                    <Popup contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        padding: "0"
                    }} trigger={<button className="inline-block text-purple-600 p-0">Read Full</button>} modal nested>
                        {close => (
                            <div>
                                <div class="border-b px-5 pb-4 border-gray-300 my-4 flex flex-row items-end">
                                    <IoDocumentSharp class="text-3xl pb-1 text-gray-700" /><div className="text-3xl font-bold inline-block"> Document {index + 1} Tokens</div>
                                </div>
                                <div className="overflow-auto p-5 text-justify flex flex-col justify-center" style={{ maxHeight: "50vh" }}>
                                    <div class="pb-5">{item[0].postText}</div>
                                </div>
                                <div className="border-t border-gray-300 my-4"></div>
                                <div className="flex flex-row justify-between items-end b-5 pb-4 px-5">
                                    <button className="inline-block text-white py-2 bg-teal-300 border rounded-lg w-1/5 hover:bg-teal-400" onClick={close}>Close</button>
                                    <div class="flex flex-col justify-right">
                                        <div className="text-sm italic">Number of Tokens: {item[1].postTokens.length}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Popup>
                </div>
            </div>
        </div>
    );
}

export { PDocumentsCard, UDocumentsCard };
