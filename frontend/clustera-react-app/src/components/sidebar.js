// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

function SideBar() {
    return (
        <nav class="bg-gray-800 p-4">
            <div class="flex justify-between items-center">
                <div>
                    <Link to="/"><a href="#" class="text-white text-xl font-bold">Clustera</a></Link>
                </div>
                <div class="hidden md:flex space-x-4">
                    <a href="#" class="text-white">Upload</a>
                    <a href="#" class="text-white">About</a>
                    <a href="#" class="text-white">Clustering Methods</a>
                </div>
            </div>
        </nav>
    );
};

export default SideBar;
