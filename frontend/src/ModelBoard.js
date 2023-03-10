import './ModelBoard.css';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './Api.js'
import ModelTable from './ModelTable';

function ModelBoard(props){

    const [origModels, setOrigModels] = useState([]);
    const [models, setModels] = useState([]);

    const [modelsLoadFailed, setModelsLoadFailed] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const maxRows = 10;

    // Wrapper around setOrigModels and setModels to do pagination correctly
    function makeModels(newModels){
        setOrigModels(newModels)
        setModels(newModels)
    }

    useEffect(() => {

        async function getModels() {
            console.log("Getting models")
            let url = BACKEND_URL + "info/manifest"
            try {
                const response = await fetch(url);
                const myJson = await response.json(); //extract JSON from the http response

                if (myJson['response'] !== 'succeeded'){
                    throw new Error("Server returned failed")
                }
            
                // "Cannot modify state directly", hence setState
                setModelsLoaded(true);
                makeModels(myJson['content']);
            } 
            catch (error) {
                console.error(error);
                setModelsLoadFailed(true);
            }
        }

        if (modelsLoaded === false){
            getModels();
        }

    }, [modelsLoaded, makeModels]);

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
                    <ModelTable content={models} maxRows={maxRows} />
                </div>
            </div>
        )
    }

}

export default ModelBoard;
