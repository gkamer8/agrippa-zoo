import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BACKEND_URL } from './Api';
import Flow from './Flow';
import { ReactFlowProvider } from 'reactflow';
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
                    <Link to={"/model/"+id}><span className='model-link'>{modelInfo.name}</span></Link>
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
    }, [modelInfo, modelLoadFailed, modelLoaded, id])

    return (
        <div id="workspace-container">
            {modelInfoBox}
            <div id="editor-and-options">
                <div id="flow-container">
                <ReactFlowProvider><Flow id={id} /></ReactFlowProvider>
                </div>
            </div>
        </div>

    );
}

export default Workspace;