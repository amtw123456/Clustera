import React from 'react';
import { AiFillEye } from 'react-icons/ai';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function documentsCard({ index, item }) {
    return (
        <div className="w-[900px] h-28 my-3 mx-4 h-20 border rounded-lg bg-gray-100" key={index}>
            <div className="my-2 pb-2 pt-2 px-2">
                <div>
                    {index + 1 + ". " + item.postText.slice(0, 140) + "......."}
                    <AiFillEye className="inline-block text-purple-800 text-lg" />
                    <Popup trigger={<button className="inline-block text-purple-600">Read Full</button>} modal nested>
                        <div>This is the content inside the popup.</div>
                    </Popup>
                    {/* <Popup trigger={<button>Open Popup</button>} position="right center">
            <div>This is the content inside the popup.</div>
          </Popup> */}
                </div>
            </div>
        </div>
    );
}

export default documentsCard;
