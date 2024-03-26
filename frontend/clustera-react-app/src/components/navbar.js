// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";


function NavigationBar() {
    const location = useLocation();

    console.log("Current route:", location.pathname);
    let middleText;
    if (location.pathname == "/") {
        middleText = "Upload";
    }
    else if (location.pathname == "/documentsPage") {
        middleText = "Documents";
    }
    else {
        middleText = "Lsa Clustering";
    }

    return (
        <nav class="bg-gray-800 py-2 px-4 top-0 left-0 right-0 z-0">
            <div class="flex justify-between items-center">
                <div class="flex-1 justify-start">
                    <Link to="/"><a href="#" class="text-white text-xl font-bold">Clustera</a></Link>
                </div>
                <div class="hidden md:flex space-x-4 justify-center flex-1">
                    <a href="#" class="text-white text-3xl">{middleText}</a>
                </div>
                <div class="hidden md:flex space-x-4 flex-1 justify-end">
                    <a href="#" class="text-white">Upload</a>
                    <a href="#" class="text-white">About</a>
                    <a href="#" class="text-white">Clustering Methods</a>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
