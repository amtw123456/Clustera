// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";


function NavigationBar() {
    // const location = useLocation();

    // console.log("Current route:", location.pathname);
    // let middleText;
    // if (location.pathname == "/") {
    //     middleText = "Upload";
    // }
    // else if (location.pathname == "/documentsPage") {
    //     middleText = "Documents";
    // }
    // else {
    //     middleText = "Lsa Clustering";
    // }

    return (
        <nav class="bg-blue-600 py-2 px-4 top-0 left-0 right-0 z-50">
            <div class="flex justify-between items-center">
                <div class="flex-1 justify-start grow">
                    <Link to="/"><a href="#" class="text-white text-2xl font-bold">Clustera</a></Link>
                </div>
                {/* <div class="hidden md:flex space-x-4 justify-center flex-1">
                    <a href="#" class="text-white text-2xl">{middleText}</a>
                </div> */}
                <div class="hidden md:flex space-x-9 flex-1 justify-end">
                    <Link to="/" class="text-white text-base hover:bg-gray-300">Upload</Link>
                    <Link to="/aboutPage" class="text-white text-base hover:bg-gray-300">About</Link>
                    <Link to="/documentationPage" class="text-white text-base hover:bg-gray-300">Documentation</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
