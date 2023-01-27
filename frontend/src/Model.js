import { BACKEND_URL } from './Api';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Model.css';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { FileUpload, TextInput } from './Form.js';

// Takes props username and isLoggedIn
function Model(props){

    const [modelInfo, setModelInfo] = useState({});
    const [modelLoadFailed, setModelLoadFailed] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);

    const [modelReadme, setModelReadme] = useState("");
    const [modelReadmeLoadFailed, setModelReadmeLoadFailed] = useState(false);
    const [modelReadmeLoaded, setModelReadmeLoaded] = useState(false);

    const [modelDeleteStatus, setModelDeleteStatus] = useState(0);
    const [submitFilesStatus, setSubmitFilesStatus] = useState(0);
    const [submitModelNameStatus, setSubmitModelNameStatus] = useState(0);
    const [submitAuthorNameStatus, setSubmitAuthorNameStatus] = useState(0);
    
    const [fileArray, setFileArray] = useState([]);

    const [isEditMode, setIsEditMode] = useState(false);

    let { id } = useParams();

    useEffect(() => {

        async function getModel(){
            console.log("Getting jawn")
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
        async function getReadme(){
            let url = BACKEND_URL + "download/readme?id=" + id;
            try {
                const response = await fetch(url);
                const myStr = await response.text();
            
                setModelReadmeLoaded(true);
                setModelReadme(myStr);
            } 
            catch (error) {
                console.error(error);
                setModelReadmeLoadFailed(true);
            }
        }
        getModel();
        getReadme();

    }, [id])

    // Set the text inputs to the appropriate values when the model is in edit model
    useEffect(() => {
        if (isEditMode){
            document.getElementById("model-name-text-box").value = modelInfo['name'];
            document.getElementById("model-author-text-box").value = modelInfo['author_name'];
        }
    }, [isEditMode, modelInfo]);

    if (modelLoaded === false && modelLoadFailed === false){
        return (
            <div>Loading model...</div>
        )
    }
    else if (modelLoadFailed === true){
        return (
            <div>Model failed to load. Try again.</div>
        )
    }
    else{
        let model_name = modelInfo['name'];
        let model_author = modelInfo['author_name'];
        let short_desc = modelInfo['short_desc'];
        let canonical = modelInfo['canonical'];
        let tags = JSON.parse(modelInfo['tags']);
        let md_text = modelReadme;
        
        let canon = ""
        if (canonical){
            canon = (
                <div className='canonical'>Canonical</div>
            );
        }

        let readme_header = "";
        let tag_arr = []
        // Go through the tags, make it an array that can be passed like model squares is
        for (const [key, value] of Object.entries(tags)) {
            tag_arr.push([key, value])
        }

        // if we're waiting for it to load or it's loaded
        if(modelReadmeLoaded && md_text !== "" && modelReadmeLoadFailed !== true){
            readme_header = (
                <div>
                    <div className='readme-header'>README.md</div>
                    <br/><br/>
                </div>
            );
        }

        function makeTag(item){
            return (
                <span key={item} className="tag">{item}</span>
            );
        }

        function makeTagGroup(item){
            const listTags = item[1].map(makeTag);
            return (
                <div className='tag-group' key={item[0]}>
                    <div className='tag-group-name'>{item[0]}</div>
                    {listTags}
                </div>
            );
        }

        let modelName = (
                <div id='model-name-comp'>
                    <div id='normal-model-name' style={{'display': 'block'}}>
                        <div className='model_name' id='model_name'>
                            {model_name}
                        </div>
                    </div>
                </div>
            )

        let modelAuthorComponent = (
            <div style={{'display': 'inline-block'}}>
                <span style={{'display': 'inline'}} id='true-model-author'>{model_author}</span>
            </div>
        )

        // For the edit button
        function reveal(){
            if (isEditMode){
                setIsEditMode(false)
            }
            else {
                setIsEditMode(true);
            }
        }

        let ownerOptions = "";
        if(props.isLoggedIn){
            if (modelInfo.username === props.username){
                ownerOptions = (
                    <div className='owner-options'>
                        You own this model. <span onClick={reveal} style={{'text-decoration': 'underline', 'cursor': 'pointer'}}>Edit</span>
                    </div>
                );
            }
        }
        
        let listTagGroups = tag_arr.map(makeTagGroup);

        if (isEditMode){

            // First: the model name text box
            
            let modelNameStatusComponent = ""
            if (submitModelNameStatus === 1){
                modelNameStatusComponent = <div className='model-name-status-text'>Submitting new model name...</div>
            }
            else if (submitModelNameStatus === 2){
                modelNameStatusComponent = <div className='model-name-status-text'>Model name successfully changed.</div>
            }
            else if (submitModelNameStatus === 3){
                modelNameStatusComponent = <div className='model-name-status-text'>Failed to change model name.</div>
            }

            async function submitModelName(){

                setSubmitModelNameStatus(1);
                let fileData = new FormData();
                fileData.append('id', id);
                let newModelName = document.getElementById('model-name-text-box').value;
                fileData.append('model_name', newModelName)
                let url = BACKEND_URL + "update/edit"
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'x-access-token': localStorage.getItem("auth_token"),
                        },
                        body: fileData
                     });
                    const myJson = await response.json(); //extract JSON from the http response
        
                    console.log(myJson);
        
                    if (myJson.response === 'failed'){
                        setSubmitModelNameStatus(3);
                    }
                    else {
                        let newModelInfo = {...modelInfo}
                        newModelInfo['name'] = newModelName;
                        setModelInfo(newModelInfo);
                        setSubmitModelNameStatus(2);
                    }
                } 
                catch (error) {
                    console.error(error);
                    setSubmitModelNameStatus(3);
                }
            }

            modelName = (
                <div id='model-name-comp'>
                    <div id='editable-model-name'>
                        <TextInput id='model-name-text-box' className='model_name editable-model-name' />
                        <div onClick={submitModelName} style={{'margin-bottom': '1em', 'text-decoration': 'underline', 'cursor': 'pointer', 'display': 'inline-block'}}>Submit Name Change</div>
                        {modelNameStatusComponent}
                    </div>
                </div>
            )
            
            // Now that the model name stuff is taken care of, now for the delete option

            async function onDelete(){
                    
                if (!window.confirm("Are you sure you want to delete this model?")) {
                    return
                }

                setModelDeleteStatus(1);
                let fileData = new FormData();
                fileData.append('id', id);
                let url = BACKEND_URL + "update/delete"
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'x-access-token': localStorage.getItem("auth_token"),
                        },
                        body: fileData
                        });
                    const myJson = await response.json(); //extract JSON from the http response
        
                    console.log(myJson);
        
                    if (myJson.response === 'failed'){
                        setModelDeleteStatus(3);
                    }
                    else {
                        setModelDeleteStatus(2);
                    }
                } 
                catch (error) {
                    console.error(error);
                    setModelDeleteStatus(3);
                }                    
            }

            let deleteOptions = "";
            if (modelDeleteStatus === 0){
                deleteOptions = <span className='delete-option' onClick={onDelete}>Delete Model</span>
            }
            else if (modelDeleteStatus === 1){
                deleteOptions = <span className='delete-option'>Deleting model...</span>
            }
            else if (modelDeleteStatus === 2){
                deleteOptions = <span className='delete-option'>Model deleted.</span>
            }
            else if (modelDeleteStatus === 3){
                deleteOptions = <span className='delete-option'>Failed to delete model.</span>
            }

            // Submit files button
            function handleFileChange(e){
                let fileList = e.target.files;
                let n = fileList.length;
                let newFileArray = [];
                for (let i = 0; i < n; i++){
                    newFileArray.push(fileList[i]);
                }
                setFileArray(newFileArray);
            }

            async function submitFiles(){

                setSubmitFilesStatus(1);
                let fileData = new FormData();
                for (let i = 0; i < fileArray.length; i++){
                    fileData.append('file' + i, fileArray[i]);
                }
                fileData.append('id', id);
                let url = BACKEND_URL + "update/upload"
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'x-access-token': localStorage.getItem("auth_token"),
                        },
                        body: fileData
                        });
                    const myJson = await response.json(); //extract JSON from the http response
        
                    console.log(myJson);
        
                    if (myJson.response === 'failed'){
                        setSubmitFilesStatus(3);
                    }
                    else {
                        setSubmitFilesStatus(2);
                    }
                } 
                catch (error) {
                    console.error(error);
                    setSubmitFilesStatus(3);
                }
            }

            let submitFilesResponse = "";
            if (submitFilesStatus === 1){
                submitFilesResponse = <div><br/>Submitting files...</div>
            }
            else if (submitFilesStatus === 2){
                submitFilesResponse = <div><br/>Files successfully uploaded.</div>
            }
            else if (submitFilesStatus === 3){
                submitFilesResponse = <div><br/>Failed to upload files.</div>
            }

            let fileUpload = (
                <div>
                    <FileUpload onChange={handleFileChange} buttonClassName='upload-button' />
                    <span onClick={submitFiles} className='delete-option'>Submit Files</span>
                    {submitFilesResponse}
                </div>
            )

            // Now author name

            async function submitAuthorName(){
                setSubmitAuthorNameStatus(1);
                let fileData = new FormData();
                let newAuthorName = document.getElementById('model-author-text-box').value;
                fileData.append('id', id);
                fileData.append('author_name', newAuthorName);
                let url = BACKEND_URL + "update/edit"
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'x-access-token': localStorage.getItem("auth_token"),
                        },
                        body: fileData
                        });
                    const myJson = await response.json(); //extract JSON from the http response
        
                    console.log(myJson);
        
                    if (myJson.response === 'failed'){
                        setSubmitAuthorNameStatus(3);
                    }
                    else {
                        let newModelInfo = {...modelInfo}
                        newModelInfo['author_name'] = newAuthorName;
                        setModelInfo(newModelInfo);
                        setSubmitAuthorNameStatus(2);
                    }
                } 
                catch (error) {
                    console.error(error);
                    setSubmitAuthorNameStatus(3);
                }
            }

            let modelAuthorStatusComponent = "";
            if (submitAuthorNameStatus === 1){
                modelAuthorStatusComponent = (
                    <span style={{'margin-left': '.5em'}}>Submitting...</span>
                )
            }
            else if (submitAuthorNameStatus === 2){
                modelAuthorStatusComponent = (
                    <span style={{'margin-left': '.5em'}}>Submitted successfully.</span>
                )
            }
            else if (submitAuthorNameStatus === 3){
                modelAuthorStatusComponent = (
                    <span style={{'margin-left': '.5em'}}>Failed.</span>
                )
            }

            modelAuthorComponent = (
                <div style={{'display': 'inline-block'}}>
                    <div style={{'display': 'inline-block', 'margin-right': '.5em'}}>
                        <TextInput id='model-author-text-box' />
                    </div>
                    <span onClick={submitAuthorName} className='delete-option'>Submit</span>
                    {modelAuthorStatusComponent}
                </div>
            )

            // This should be at bottom of this whole thing
            ownerOptions = (
                <div className='owner-options'>
                    You own this model. <span onClick={reveal} style={{'text-decoration': 'underline', 'cursor': 'pointer'}}>Edit</span>
                    <div style={{'margin-top': '1em'}}>
                        {deleteOptions}
                    </div>
                    <div style={{'margin-top': '1em'}}>
                        {fileUpload}
                    </div>
                </div>
            )
        };

        return (
            <div className='content-container'>
                <div className='model_card'>
                    {modelName}
                    {canon}
                    {ownerOptions}
                    <br/>
                    <div>
                        <span className='author'>Author: </span>{modelAuthorComponent}
                    </div>
                    <div className='download-block'>
                        <a href={BACKEND_URL + "download/markup?download=1&id=" + id} download={true}>
                            <span className='download-text'>Download Markup</span>
                        </a>
                    </div>
                    <div className='download-block'>
                        <Link to={"/workspace/" + id}><span className='download-text'>View in Workspace</span></Link>
                    </div>
                    <div className='short_desc'>{short_desc}</div>
                    {listTagGroups}
                    {readme_header}
                    <ReactMarkdown>
                        {md_text}
                    </ReactMarkdown>
                </div>
            </div>
        )
    }

}

export default Model;