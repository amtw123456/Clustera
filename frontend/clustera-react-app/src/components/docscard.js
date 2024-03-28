import React from 'react';
import { AiFillEye } from 'react-icons/ai';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function DocumentsCard({ index, item }) {
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
                                <div className="border-b px-5 pb-4 border-gray-300 my-4 text-3xl font-bold">Document {index + 1}</div>
                                <div className="overflow-auto p-5 text-justify flex flex-col justify-center" style={{ maxHeight: "50vh" }}>
                                    <div class="pb-5">{item.postText}</div>
                                </div>
                                {/* Divider */}
                                <div className="border-t border-gray-300 my-4"></div>
                                {/* Close button */}
                                <div className="flex justify-center pb-5">
                                    <button className="inline-block text-white py-2 bg-teal-400 border rounded-lg w-1/5" onClick={close}>Close</button>
                                </div>
                            </div>
                        )}
                    </Popup>
                </div>
            </div>
        </div>
    );
}

export default DocumentsCard;
