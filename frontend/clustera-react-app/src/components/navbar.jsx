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
        <nav className="bg-blue-600 py-2 px-4 top-0 left-0 right-0 z-50">
            <div className="flex justify-between items-center">
                <div className="flex-1 justify-start grow">
                    <Link to="/" className="text-white text-2xl font-bold">Clustera</Link>
                </div>
                <div className="hidden md:flex space-x-9 flex-1 justify-end">
                    <Link to="/" className="text-white text-base hover:bg-gray-300">Upload</Link>
                    <Link to="/aboutPage" className="text-white text-base hover:bg-gray-300">About</Link>
                    <Link to="/documentationPage" className="text-white text-base hover:bg-gray-300">Documentation</Link>
                </div>
            </div>
        </nav >
    );
};

export default NavigationBar;
