import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from './Api';
import Flow from './Flow';
import "./Workspace.css"


function Workspace(props){

    const [modelInfo, setModelInfo] = useState({});
    const [modelLoaded, setModelLoaded] = useState(false);
    const [modelLoadFailed, setModelLoadFailed] = useState(false);
    const [modelInfoBox, setModelInfoBox] = useState("");
    let { id } = useParams();

    useEffect(() => {
        async function getModel(){
            let url = BACKEND_URL + "info/model?id=" + id;
            try {
                const response = await fetch(url);
                const myJson = await response.json(); //extract JSON from the http response
            
                setModelInfo(myJson);
                setModelLoaded(true);
            } 
            catch (error) {
                console.error(error);
                setModelLoadFailed(true);
            }
        }
        getModel();
    }, [id])

    useEffect(() => {
        if (modelLoaded){
            setModelInfoBox(
                <div id="model-info">
                    {modelInfo.name}
                </div>
            ) 
        }
        else if (modelLoadFailed){
            setModelInfoBox(
                <div id="model-info">
                    Model info could not be loaded.
                </div>
            ) 
        }
        else {
            setModelInfoBox(
                <div id="model-info">
                    Loading...
                </div>
            ) 
        }
    }, [modelInfo, modelLoadFailed, modelLoaded])

    return (
        <div id="workspace-container">
            {modelInfoBox}
            <div id="editor-and-options">
                <div id="flow-container">
                    <Flow />
                </div>
            </div>
        </div>

    );
}

export default Workspace;