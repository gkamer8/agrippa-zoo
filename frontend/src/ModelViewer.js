import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BACKEND_URL } from './Api';
import Flow from './Flow';
import { ReactFlowProvider } from 'reactflow';
import "./ModelViewer.css"


function ModelViewer(props){

    const [modelInfo, setModelInfo] = useState({});
    const [modelLoaded, setModelLoaded] = useState(false);  // for model info
    const [modelLoadFailed, setModelLoadFailed] = useState(false);
    const [modelInfoBox, setModelInfoBox] = useState("");
    
    let id = props.model_id;

    const [fileTextArray, setFileTextArray] = useState([]);
    const [fileTextLoadState, setFileTextLoadState] = useState(0);
    const [fileTextLabels, setFileTextLabels] = useState([]);
    const [fileTextChosen, setFileTextChosen] = useState(0);

    // for getting the model info
    useEffect(() => {
        async function getModel(){
            let url = BACKEND_URL + "info/model?id=" + id + "&markup_manifest=1";
            try {
                const response = await fetch(url);
                const myJson = await response.json(); //extract JSON from the http response
            
                setModelInfo(myJson);
                setModelLoaded(true);
                setFileTextLoadState(1);  // this should trigger file texts to start loading
            } 
            catch (error) {
                console.error(error);
                setModelLoadFailed(true);
            }
        }
        getModel();
    }, [id])

    // get the text of all the files
    useEffect(() => {

        async function getModelText() {
            // setFileTextLoadState(1);  // should already be set
            console.log("Getting model text")

            let filesToGet = modelInfo['markup_paths'];
            let fileIndex = modelInfo['file_index'];
            let url = BACKEND_URL + "download/file";

            let newFileTextArray = [];
            let newFileTextLabels = []

            let errorOccurred = false;

            for (let i in filesToGet){
                let file = filesToGet[i]
                let fileData = new FormData();
                fileData.append('id', id);
                fileData.append('filename', file)
                try {
                    // Shouldn't need to send any authorization
                    const response = await fetch(url, {
                        method: 'POST',
                        body: fileData
                    });
                    const xmlText = await response.text();
                    newFileTextArray.push(xmlText);
                    newFileTextLabels.push(file);
                } 
                catch (error) {
                    console.error(error);
                    errorOccurred = true;
                    break;
                }
            }
            if (errorOccurred){
                setFileTextLoadState(3);
            }
            else {
                // Rearrange so that the index file is first
                let indexIndex = 0;
                for (let i = 0; i < newFileTextLabels.length; i++){
                    if (newFileTextLabels[i] === fileIndex){
                        indexIndex = i;
                        break;
                    }
                }
                // Swap their labels
                [newFileTextLabels[0], newFileTextLabels[indexIndex]] = [newFileTextLabels[indexIndex], newFileTextLabels[0]];
                // Swap their texts
                [newFileTextArray[0], newFileTextArray[indexIndex]] = [newFileTextArray[indexIndex], newFileTextArray[0]];
                setFileTextArray(newFileTextArray);
                setFileTextLabels(newFileTextLabels);
                setFileTextLoadState(2);  // loaded
            }
        }

        if (modelLoaded && fileTextLoadState === 1){
            getModelText();
        }

    }, [id, modelLoaded, fileTextLoadState, modelInfo]);

    // for when you click on a file name
    function revealFlow(index){
        setFileTextChosen(index);
    }

    // For setting "loading"
    // NOTE: this doesn't need to be in a useEffect probably
    useEffect(() => {
        if (modelLoaded && fileTextLoadState === 2){

            function makeFileLink(index){
                let name = fileTextLabels[index];
                let className = 'file-link'
                if(fileTextChosen === index){
                    className += ' file-link-chosen'
                }
                return (
                    <div key={index} className={className} onClick={() => revealFlow(index)}>{name}</div>
                )
            }
            let fileNameIndices = Array.from({length: fileTextLabels.length}, (_, i) => i);
            let fileLinks = fileNameIndices.map(makeFileLink);
            setModelInfoBox(
                <div id="model-info">
                    <div>
                        <Link to={"/model/"+id}><span className='model-link'>{modelInfo.name}</span></Link>
                    </div>
                    <div>
                        {fileLinks}
                    </div>
                </div>
            ) 
        }
        else if (modelLoaded){
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
    }, [modelInfo, modelLoadFailed, modelLoaded, id, fileTextLabels, fileTextLoadState, fileTextChosen])


    function onSourcedClick(childPath, parentPath){
        if (childPath.startsWith("/")) {
            return childPath;
        }
        let parent = parentPath.split("/");
        parent.pop();
        let child = childPath.split("/");
        let fullPath = parent.concat(child);
        fullPath = fullPath.join("/");
        
        // Find that full path among the fileTextLabels
        for (let i = 0; i < fileTextLabels.length; i++){
            if (fileTextLabels[i] === fullPath){
                setFileTextChosen(i);
                return;
            }
        }
    }

    let flowComponents = <div></div>
    if (fileTextLoadState === 1 || fileTextLoadState === 0){
        flowComponents = <div>Loading files...</div>
    }
    else if (fileTextLoadState === 3){
        flowComponents = <div>Error loading files. Try again.</div>
    }
    else {
        let fileText = fileTextArray[fileTextChosen];
        let filename = fileTextLabels[fileTextChosen];
        flowComponents = (
            <div className="flow-container">
                <ReactFlowProvider>
                    <Flow onSourcedClick={(clickedPath) => {onSourcedClick(clickedPath, filename)}} fileText={fileText} />
                </ReactFlowProvider>
            </div>
        )
    }
    
    let height = props.height;
    if (!height){
        height = "75vh";
    }

    return (
        <div>
            {modelInfoBox}
            <div id="editor-and-options" style={{'height': height}}>
                {flowComponents}
            </div>
        </div>

    );
}

export default ModelViewer;