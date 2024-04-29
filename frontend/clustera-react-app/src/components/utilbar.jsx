// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";


function UtilitiesBar() {

    return (
        <div>
            <div className="flex justify-between items-center">
                {/* <div className="hidden md:flex space-x-4 justify-center flex-1">
                    <a href="#" className="text-white text-2xl">{middleText}</a>
                </div> */}
                <div className="hidden md:flex space-x-4 flex-1 justify-center">
                    <div className="text-gray-600 mt-3 text-4xl">Documents Hub</div>
                </div>
            </div>
            <nav className="py-2 px-4 top-0 left-0 right-0 z-0">
                <div className="flex justify-between items-center">
                    {/* <div className="hidden md:flex space-x-4 justify-center flex-1">
                    <a href="#" className="text-white text-2xl">{middleText}</a>
                </div> */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <a href="/cluster_page_lsa" className="text-blue-400 text-base border-b pl-24 pt-1">Cluster using LSA</a>
                        <a href="#" className="text-blue-400 text-base border-b px-24 pt-1">Text Pre-Processing</a>
                        <a href="/cluster_page_lda" className="text-blue-400 text-base border-b pr-24 pt-1">Cluster using LDA</a>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default UtilitiesBar;
