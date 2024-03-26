// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Waves from '../assets/purple-layered-waves.svg';

const PurpleWave = () => {

    return (
        <img src={Waves} class="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" alt="background" />
    );

};

export default PurpleWave;
