// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

function NavigationBar() {
    return (
        <nav class="bg-gray-800 p-4">
            <div class="flex justify-between items-center">
                <div>
                    <a href="#" class="text-white text-xl font-bold">Clustera</a>
                </div>
                <div class="hidden md:flex space-x-4">
                    <a href="#" class="text-white">Home</a>
                    <a href="#" class="text-white">About</a>
                    <a href="#" class="text-white">Services</a>
                    <a href="#" class="text-white">Portfolio</a>
                    <a href="#" class="text-white">Contact</a>
                </div>
                <div class="md:hidden">
                    <button id="mobile-menu-toggle" class="text-white focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
