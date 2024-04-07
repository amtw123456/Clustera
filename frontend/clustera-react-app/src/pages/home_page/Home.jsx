// ClusteraApp.jsx
import React, { useState } from 'react';
import { Upload } from "./Upload";
import { Link } from "react-router-dom";
import NavigationBar from '../../components/navbar.jsx';

const HomePage = () => {
    return (
        <div>
            <NavigationBar>
            </NavigationBar>
            <div class="flex flex-col items-center justify-center h-screen text-center">
                <h3 class="w-3/5 font-bold mx-auto bg-gradient-to-r from-yellow-500 from-10% to-pink-500 to-90% text-transparent bg-clip-text text-[40px]">Home</h3>
                <h1 class="w-1/5 font-bold mx-auto bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clustera</h1>
                <div class="text-[15px] font-bold text-black-700">An application that allows you to Cluster, Categorize and Classify Textual Documents</div>
                <Upload>
                </Upload>
            </div>
        </div>
    );
};

export default HomePage;
