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

    const [fileTextArray, setFileTextArray] = useState('');
    const [fileTextLoadState, setFileTextLoadState] = useState('');

    useEffect(() => {

        async function getModel() {
            // TODO: load all markup files (include README?) 
            setFileTextLoadState(1);  // loading
            console.log("Getting model")
            let url = BACKEND_URL + "download/markup?id=" + id;  // this should get the index file
            try {
                const response = await fetch(url);
                const xmlText = await response.text(); //extract JSON from the http response
                setFileTextArray([xmlText]);
                setFileTextLoadState(2);  // loaded
            } 
            catch (error) {
                console.error(error);
                setFileTextLoadState(3);
            }
        }

        getModel();

    }, [id]);

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


    let flowComponents = <div></div>
    if (fileTextLoadState === 1){
        flowComponents = <div>Loading files...</div>
    }
    else if (fileTextLoadState === 3){
        flowComponents = <div>Error loading files. Try again.</div>
    }
    else {
        function makeFlowComponent(index){
            let fileText = fileTextArray[index];
            let disp = index === 0 ? "block" : "none";
            return (
                <div className="flow-container" id={"flow-container-" + index} style={{'display': disp}}>
                    <ReactFlowProvider><Flow id={id} fileText={fileText} /></ReactFlowProvider>
                </div>
            )
        }
    
        let fileTextIndexArray = Array.from({length: fileTextArray.length}, (_, i) => i);
        flowComponents = fileTextIndexArray.map(makeFlowComponent);
    }
    
    return (
        <div id="workspace-container">
            {modelInfoBox}
            <div id="editor-and-options">
                {flowComponents}
            </div>
        </div>

    );
}

export default Workspace;