import React, { useEffect, useState, useContext } from "react";
import { Link, json, useLocation, useParams } from 'react-router-dom'
import { AppContext } from '../../providers/AppState.js';
import NavigationBar from '../../components/navbar.js';

function LSApage() {
  const { uploadedData, setUploadedData } = useContext(AppContext);
  const { preprocessedText, setPreprocessedText } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This will log the updated state whenever the component mounts
    console.log(uploadedData)
    console.log(preprocessedText)
    console.log(JSON.stringify({ "preprocessed_text": preprocessedText, "num_topics": 4 }))

  }, []);

  const clusterUsingLsa = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://127.0.0.1:8000/lsa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "preprocessed_text": preprocessedText, "num_topics": 4 }),
      });

      const responseData = await response.json();
      console.log(responseData)
    } catch (error) {
      console.error('Error during text preprocessing:', error);
      // Handle errors if necessary
    } finally {
      setIsLoading(false);


    }
  };

  return (
    <div class="">
      <NavigationBar>

      </NavigationBar>
      <h1 class="text-center bg-red-400 font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clusters LSA</h1>
      <div class="flex items-center justify-center mb-5">
        <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center flex items-center">
          <Link to="/">Upload Documents</Link>
        </button>
      </div>
      <div class="flex items-center justify-center mb-5">
        <button class="w-60 bg-blue-500 mx-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center flex items-center" onClick={() => clusterUsingLsa()}>
          Cluster Using LSA
        </button>
      </div>
      <div class="flex flex-wrap justify-center items-center">
        {
          preprocessedText.map((item, index) => (
            <div class="w-full h-20 border" key={index}>
              <div class="my-2 pb-2 pt-2 px-3">{index + 1 + ". " + item.slice(0, 120)}</div>
            </div>
          ))
        }
      </div>

    </div>
  );
}

export default LSApage;
