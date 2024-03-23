import React, { useEffect, useState } from "react";
import { Link, json, useLocation, useParams } from 'react-router-dom'

function LSApage(props) {

  const { type } = useParams();
  // const jsonData = useLocation().state.documents;
  // const [newJsonData, setNewJsonData] = useState([]);
  const [responseInfo, setResponseInfo] = useState([]);
  const [isPreProcessed, setIsPreProcessed] = useState(false);
  const [isPreProcessedBool, setIsPreProcessedBool] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This will log the updated state whenever the component mounts
    console.log("RED");
    // console.log(jsonData);
    // setNewJsonData(jsonData);

    // console.log(newJsonData);
  }, []);

  // const clusterDocumentsViaLsa = async () => {
  //   setIsPreProcessed((prevValue) => !prevValue);
  //   setIsPreProcessed(true);
  //   try {
  //     setIsLoading(true);

  //     const response = await fetch('http://127.0.0.1:8000', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(jsonData),
  //     });

  //     const responseData = await response.json();
  //     setResponseInfo(responseData.preprocessed_text);
  //   } catch (error) {
  //     console.error('Error during text preprocessing:', error);
  //     // Handle errors if necessary
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div class="">
      <h1 class="text-center bg-red-400 font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clusters LSA</h1>
    </div>
  );
}

export default LSApage;
