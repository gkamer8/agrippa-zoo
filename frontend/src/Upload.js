import './Upload.css';
import { BACKEND_URL } from './Api';
import { useState } from 'react';
import { TextInput, TextBox, Button, Checkmark, FileUpload } from './Form';

function Upload(props) {

    const [sentStatus, setSentStatus] = useState(0);
    const [fileArray, setFileArray] = useState([]);
    const [inputTags, setInputTags] = useState([]);
    const [outputTags, setOutputTags] = useState([]);
    const [canonChecked, setCanonChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleFileChange(e){
        let fileList = e.target.files;
        let n = fileList.length;
        let newFileArray = [];
        for (let i = 0; i < n; i++){
            newFileArray.push(fileList[i]);
        }
        setFileArray(newFileArray);
        // addNewOption();
    }

    function getTagFormData(){
        let inputTagString = "["
        for (let i = 0; i < inputTags.length; i++){
            if(i === inputTags.length - 1){
                inputTagString += "\"" + inputTags[i] + "\"";
            }
            else {
                inputTagString += "\"" + inputTags[i] + "\", ";
            }
        }
        inputTagString += "]"

        let outputTagString = "["
        for (let i = 0; i < outputTags.length; i++){
            if(i === outputTags.length - 1){
                outputTagString += "\"" + outputTags[i] + "\"";
            }
            else {
                outputTagString += "\"" + outputTags[i] + "\", ";
            }
        }
        outputTagString += "]"
        return `{"input": ${inputTagString}, "output": ${outputTagString}}`;
    }

    function notifyMissing(name){
        alert(`Missing ${name}`);
    }

    async function sendToAPI() {

        let fileData = new FormData();

        let model_name = document.getElementById('model-name').value;
        let author_name = document.getElementById('author-name').value;
        let short_desc = document.getElementById('short-desc').value;
        let canonical = canonChecked;
        let file_index = document.getElementById('file-index').value;
        let tagData = getTagFormData();

        if (!model_name){
            notifyMissing("model name");
            return;
        }
        else if (!author_name){
            notifyMissing("author name");
            return;
        }
        else if (!short_desc){
            notifyMissing("short description");
            return;
        }
        else if (inputTags.length === 0){
            notifyMissing("input tags");
            return;
        }
        else if (outputTags.length === 0){
            notifyMissing("output tags");
            return;
        }
        else if (fileArray.length === 0){
            notifyMissing("file(s)");
            return;
        }
        else if (!file_index){
            notifyMissing("index file");
            return;
        }

        fileData.append('model_name', model_name);
        fileData.append('author_name', author_name);
        fileData.append('short_desc', short_desc);
        fileData.append('tags', tagData);
        fileData.append('canonical', canonical);
        fileData.append('file_index', file_index);
        for (let i = 0; i < fileArray.length; i++){
            fileData.append('file' + i, fileArray[i]);
        }
        setSentStatus(1);
        let url = BACKEND_URL + "user/upload"
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
                setErrorMessage("" + myJson.why);
                setSentStatus(3);
            }
            else {
                setSentStatus(2);
            }
        } 
        catch (error) {
            console.error(error);
            setErrorMessage("error connecting to server")
            setSentStatus(3);
        }
    }

    function onSubmit(){
        sendToAPI();
        console.log("Sending...")
    }

    function deleteInputTag(index){
        let newInputTags = [...inputTags];
        newInputTags.splice(index, 1);
        setInputTags(newInputTags);
    }

    function deleteOutputTag(index){
        let newOutputTags = [...outputTags];
        newOutputTags.splice(index, 1);
        setOutputTags(newOutputTags);
    }

    function makeInputTag(index){
        return (
            <div className='tag-box' key={index}>
                {inputTags[index]} <span onClick={() => deleteInputTag(index)} className='tag-delete'>X</span>
            </div>
        )
    }

    function makeOutputTag(index){
        return (
            <div className='tag-box' key={index}>
                {outputTags[index]} <span onClick={() => deleteOutputTag(index)} className='tag-delete'>X</span>
            </div>
        )
    }

    function addInputTag(){
        let tag = document.getElementById("input-tag").value;

        if (!tag){
            return;
        }

        if (tag.indexOf("\"") !== -1){
            alert("You cannot place a quotation mark inside a tag.")
            return;
        }

        let newInputTags = [...inputTags];
        newInputTags.push(tag);
        setInputTags(newInputTags);
        document.getElementById("input-tag").value = "";
    }

    function addOutputTag(){
        let tag = document.getElementById("output-tag").value;

        if (!tag){
            return;
        }

        if (tag.indexOf("\"") !== -1){
            alert("You cannot place a quotation mark inside a tag.")
            return;
        }

        let newOutputTags = [...outputTags];
        newOutputTags.push(tag);
        setOutputTags(newOutputTags);
        document.getElementById("output-tag").value = "";
    }

    const canonChange = (event) => {
        setCanonChecked(!canonChecked);
    }

    function handleOutputTagKeyDown(e){
        if (e.keyCode === 13){  // enter key
            addOutputTag();
        }
    }

    function handleInputTagKeyDown(e){
        if (e.keyCode === 13){  // enter key
            addInputTag();
        }
    }

    const inputTagLabels = [...Array(inputTags.length).keys()].map(makeInputTag);
    const outputTagLabels = [...Array(outputTags.length).keys()].map(makeOutputTag);
    let statusText = "";
    if (sentStatus === 0){
        statusText = "";  // Nothing has happened
    }
    else if (sentStatus === 1){
        statusText = "Submitting...";
    }
    else if (sentStatus === 2){
        return (
            <div id="content-container">
                <h1>Upload</h1>
                Successfully uploaded.
            </div>
        )
    }
    else if (sentStatus === 3){
        statusText = "An error occurred; please try again. Error message: " + errorMessage;
    }

    return (
        <div id="content-container">
            <h1>Upload</h1>
            <div id="upload-form">
                <div className='form-row'>
                    <TextInput id="model-name" placeholder="Model Name" />
                </div>
                <div className='form-row'>
                    <TextInput id="author-name" placeholder="Author Name" />
                </div>
                <div className='form-row'>
                    <TextBox id="short-desc" placeholder="Short Description" />
                </div>
                <div className='form-row'>
                    <TextInput id="input-tag" onKeyDown={handleInputTagKeyDown} placeholder="Input Tag" />
                </div>
                <div className='form-row'>
                    <Button onClick={addInputTag} value="Add Input Tag" />
                </div>
                {inputTagLabels}
                <div className='form-row'>
                    <TextInput id="output-tag" onKeyDown={handleOutputTagKeyDown} placeholder="Output Tag" />
                </div>
                <div className='form-row'>
                    <Button onClick={addOutputTag} value="Add Output Tag" />
                </div>
                {outputTagLabels}
                <div className='form-row'>
                    <Checkmark label="Canonical" onClick={canonChange} />
                </div>
                <div className='form-row'>
                    Upload a zip file of your project if sourced files are inside folders.
                </div>
                <div id="files">
                    <div className='form-row'>
                        <FileUpload id="file-selector" onChange={handleFileChange} />
                    </div>
                </div>
                <div className='form-row'>
                    <TextInput id="file-index" placeholder="Index File (main filename, e.g. 'main.agr')" />
                </div>
                <div className='form-row'>
                    <Button value="Submit" onClick={onSubmit} />
                </div>
                {statusText}
            </div>
        </div>
    );
}

export default Upload;