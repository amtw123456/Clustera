// Sidebar.jsx
import React from 'react';
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div class="bg-gray-200 mt-16 ml-5 h-screen w-72 top-0 left-0 z-10 border border-base rounded-lg fixed border-gray-300">
            <div class="ml-4 pt-4 font-bold text-2xl">Documents Hub</div>
            <ul class="mt-12">
                {/* <li><Link to="/" class="block py-2 px-6 text-black hover:bg-gray-300">Upload</Link></li> */}
                <li><Link to="/cluster_page_lda" class="block py-2 px-4 text-black hover:bg-gray-300">Text Pre-Processing</Link></li>
                <li><Link to="/cluster_page_lda" class="block py-2 px-4 text-black hover:bg-gray-300">Cluster Using LSA</Link></li>
                <li><Link to="/cluster_page_lsa" class="block py-2 px-4 text-black hover:bg-gray-300">Cluster Using LDA</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;