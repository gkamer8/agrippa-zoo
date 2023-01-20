import './Upload.css';
import { useState, useEffect } from 'react';
import { TextInput, TextBox, Button, Checkmark, FileUpload } from './Form';

function Upload(props) {

    const [fileUploadIds, setFileUploadIds] = useState([0])

    function getFileUploadForm(id){
        return (
            <div className='form-row' key={id}>
                <FileUpload onChange={handleFileChange} />
            </div>
        )
    }

    function addNewOption(){
        let x = [...fileUploadIds];
        x.push(x.length);
        setFileUploadIds(x);
        console.log(fileUploadIds);
    }

    function handleFileChange(){
        addNewOption();
    }


    return (
        <div id="content-container">
            <h1>Upload</h1>
            <div id="upload-form">
                <div className='form-row'>
                    <TextInput placeholder="Model Name" />
                </div>
                <div className='form-row'>
                    <TextInput placeholder="Author Name" />
                </div>
                <div className='form-row'>
                    <TextBox placeholder="Short Description" />
                </div>
                <div className='form-row'>
                    <TextInput placeholder="Input Tag" />
                </div>
                <div className='form-row'>
                    <Button value="Add Input Tag" />
                </div>
                <div className='form-row'>
                    <TextInput placeholder="Output Tag" />
                </div>
                <div className='form-row'>
                    <Button value="Add Output Tag" />
                </div>
                <div className='form-row'>
                    <Checkmark label="Canonical" />
                </div>
                <div id="files">
                    {fileUploadIds.map(getFileUploadForm)}
                </div>
            </div>
        </div>
    );
}

export default Upload;