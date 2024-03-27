// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";


function UtilitiesBar() {

    return (
        <div>
            <div class="flex justify-between items-center">
                {/* <div class="hidden md:flex space-x-4 justify-center flex-1">
                    <a href="#" class="text-white text-2xl">{middleText}</a>
                </div> */}
                <div class="hidden md:flex space-x-4 flex-1 justify-center">
                    <a href="#" class="text-gray-600 mt-3 text-4xl">Documents Hub</a>
                </div>
            </div>
            <nav class="py-2 px-4 top-0 left-0 right-0 z-0">
                <div class="flex justify-between items-center">
                    {/* <div class="hidden md:flex space-x-4 justify-center flex-1">
                    <a href="#" class="text-white text-2xl">{middleText}</a>
                </div> */}
                    <div class="hidden md:flex flex-1 justify-center">
                        <a href="#" class="text-blue-400 text-base border-b pl-24 pt-1">Cluster using LSA</a>
                        <a href="#" class="text-blue-400 text-base border-b px-24 pt-1">Text Pre-Processing</a>
                        <a href="#" class="text-blue-400 text-base border-b pr-24 pt-1">Cluster using LDA</a>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default UtilitiesBar;
