import './ModelBoard.css';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './Api.js'
import ModelTable from './ModelTable';

function ModelBoard(props){

    const [origModels, setOrigModels] = useState([]);
    const [modelsLoadFailed, setModelsLoadFailed] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {

        async function getModels() {
            console.log("Getting models")
            let url = BACKEND_URL + "info/manifest"
            try {
                const response = await fetch(url);
                const myJson = await response.json(); //extract JSON from the http response
            
                // "Cannot modify state directly", hence setState
                setModelsLoaded(true);
                setOrigModels(myJson);
            } 
            catch (error) {
                console.error(error);
                setModelsLoadFailed(true);
            }
        }

        if (modelsLoaded === false){
            getModels();
        }

    }, [modelsLoaded]);

    if (modelsLoaded === 0 && modelsLoadFailed === false){
        return (
            <div>Loading squares...</div>
        )
    }
    else if (modelsLoadFailed === true){
        return (
            <div>Squares failed to load. Try again.</div>
        )
    }
    else{
        return (
            <div className='content-container'>
                <div className='table-container'>
                    <ModelTable content={origModels} />
                </div>
            </div>
        )
    }

}

export default ModelBoard;
