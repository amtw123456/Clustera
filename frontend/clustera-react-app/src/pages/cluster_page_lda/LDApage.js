import React, { useEffect } from "react";
import { Link, useLocation, useParams } from 'react-router-dom'

function LDApage() {
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

  useEffect(() => {
    // This will log the updated state whenever the component mounts

  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div class="">
      <h1 class="text-center bg-red-400 font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clusters LDA</h1>
    </div>
  );
}

export default LDApage;
