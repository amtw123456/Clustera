// ClusteraApp.jsx
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import NavigationBar from '../../components/navbar.jsx';
import tutorialImageOne from "../../assets/Tutorialpt1.png";
import tutorialImageTwo from "../../assets/Tutorialpt2.png";
import tutorialImageThree from "../../assets/Tutorialpt3.png";
import tutorialImageFour from "../../assets/Tutorialpt4.png";
import tutorialImageFive from "../../assets/Tutorialpt5.png";
import tutorialImageSix from "../../assets/Tutorialpt6.png";
import tutorialImageSeven from "../../assets/Tutorialpt7.png";
import tutorialImageEight from "../../assets/Tutorialpt8.png";
import tutorialImageNine from "../../assets/Tutorialpt9.png";

const DocumentationPage = () => {
    useEffect(() => {
        document.body.style.overflow = 'auto';

    });
    const documents = [
        {
            "text": "Trump Gives Stephen Bannon Access to National Security Council."
        },
        {
            "text": "India, Japan and Australia begin discussions on launching a trilateral 'Supply Chain Resilience Initiative' (SCRI) to reduce dependency on China."
        },
        {
            "text": "France backs US on 21% minimum corporate tax proposal"
        }
    ];
    return (
        <>
            <NavigationBar />
            <div className='flex flex-col items-center overflow-auto'>
                <div className='w-3/5 border-r border-l border-b'>
                    <div className='flex flex-col px-4'>
                        <div className='text-6xl fond-bold mt-12'>Custera</div>
                        <div className='mt-6 text-lg font-bold'>Introduction: </div>
                        <div className='text-base fond-bold text-justify'>Custera is an application that allows you do document analysis in the form of clustering, classification and categorization using topic modeling methods.
                        </div>
                        <div className='mt-4 text-base fond-bold text-justify'>
                            Topic modeling methods are statistical techniques used to uncover the underlying themes(Related Subjects/Words) or topics present in a collection of documents. These methods aim to identify recurring patterns of words
                            or phrases that frequently co-occur within documents. Clustera leverages topic modeling methods to extract meaningful insights from document collections, such as identifying prevalent themes, discovering hidden relationships between documents, and facilitating exploratory analysis.
                            The results from using these methods are then used to create the clusters, classifier and category labels.
                        </div>

                        <div className='mt-4 text-base fond-bold text-justify'>
                            Sample Json File format when user would like to use the application for document analysis. Make sure the file is saved as a .json format
                        </div>

                        <div className='text-base fond-bold text-justify bg-black h-[320px] justify-center px-3 mt-3'>
                            <div className='mt-3 text text-yellow-400'>{"["}</div>
                            {documents.map((document, index) => (
                                <>
                                    <div className='ml-8 text-purple-500'>{"{"}</div>
                                    <div className='ml-12 flex flex-row'>
                                        <div className='text-sky-500'> {'"'}text{'"'} </div>
                                        <div className='text-white'>: &nbsp; </div>
                                        <div className='text-orange-300'> {'"'}{document.text}{'"'}</div>
                                    </div>
                                    {
                                        index === 2 ? (
                                            <div className='ml-8 text-purple-500'>{"}"}  </div>
                                        ) :
                                            <div className='ml-8 flex flex-row'>
                                                <div className='text-purple-500'>{"}"}  </div>
                                                <div className='text-white'>,</div>
                                            </div >
                                    }
                                </>
                            ))}
                            <div className='text-yellow-400'>{"]"}</div>
                        </div >

                        <div className='mt-6 text-lg font-bold'>Clustering the Documents: </div>
                        <div className='mt-4 text-base text-justify'>
                            Before clustering the Documents the user should have a saved json file, once the user has a collection of documents the user can now upload the data to the website. To do this
                            the user must press the upload file button in the upload page.
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageOne} />
                        </div>
                        <div className='mt-4 text-base text-justify'>
                            Once you have clicked upload file pick a file that you would like to use for the document analysis in this case the sampledata.json
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageTwo} />
                        </div>
                        <div className='mt-4 text-base text-justify'>
                            You may now go to the documents hub to do text pre-processing before we can cluster documents.
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageThree} />
                        </div>
                        <div className='mt-4 text-base text-justify'>
                            Text pre-processing is the process of removing stops words from documents
                        </div>
                        <div className='mt-1 text-base text-justify'>
                            An example would be when we apply text pre-processing on this text: The quick brown fox jumps over the lazy dog.
                        </div>
                        <div className='mt-1 text-base font-bold text-justify'>
                            Original Sentence: The quick brown fox jumps over the lazy dog.
                        </div>
                        <div className='mt-1 text-base font-bold text-justify'>
                            Preprocessed Sentence: quick brown fox jumps lazy dog.
                        </div>

                        <div className='mt-2'>
                            <img src={tutorialImageFour} />
                        </div>
                        <div className='mt-4 text-base fond-bold text-justify'>
                            Once you have clicked Text Pre-Processing button the web application will start the pre processing stage. It will show a loading circle. Wait for this to finish before pressing any Clustering Option.
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageFive} />
                        </div>
                        <div className='mt-4 text-base fond-bold text-justify'>
                            Once finished you may now press any clustering option you would like note that LSA is faster but generally produces less accurate results. LDA on the other hand is slower but is more flexible and produces more accurate results.
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageSix} />
                        </div>
                        <div className='mt-4 text-base fond-bold text-justify'>
                            Now that you are in the clustering part of the web application. You may now input the number of clusters you would like to create. You may Experiment with this until you are satisfied with the result.
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageSeven} />
                        </div>
                        <div className='mt-4 text-base fond-bold text-justify'>
                            Click on the cluster documents to start the process for clustering and getting the topics that are related to each other.
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageEight} />
                        </div>
                        <div className='mt-4 text-base fond-bold text-justify'>
                            Once the web application has finished clustering the documents this would return a result like this.
                        </div>
                        <div className='mt-2'>
                            <img src={tutorialImageNine} />
                        </div>



                    </div>


                </div>
            </div >
        </>
    );
};

export default DocumentationPage;
