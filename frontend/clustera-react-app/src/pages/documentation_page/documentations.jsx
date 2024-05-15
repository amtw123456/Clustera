// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import NavigationBar from '../../components/navbar.jsx';

const DocumentationPage = () => {
    return (
        <>
            <NavigationBar />
            <div className='flex flex-col mt-6 items-center'>
                <div className='bg-red-100 w-4/5 h-[500px]'>Clustera is </div>
                <div className='bg-red-100 w-4/5 h-[500px]'>Clustera is </div>
                <div className='bg-red-100 w-4/5 h-[500px]'>Clustera is </div>
                <div className='bg-red-100 w-4/5 h-[500px]'>Clustera is </div>
                <div className='bg-red-100 w-4/5 h-[500px]'>Clustera is </div>
                <div className='bg-red-100 w-4/5 h-[500px]'>Clustera is </div>
                <div className='bg-red-100 w-4/5 h-[500px]'>Clustera is </div>

            </div>
        </>
    );
};

export default DocumentationPage;
