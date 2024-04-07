// ClusteraApp.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Waves from '../assets/purple-layered-waves.svg';

const PurpleWave = () => {

    return (
        <img src={Waves} class="inset-0 w-full h-full object-cover z-50 pointer-events-none fixed" alt="background" />
    );

};

export default PurpleWave;
