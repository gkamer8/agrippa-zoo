import './Upload.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { BACKEND_URL } from './Api.js'
import { TextInput, TextBox, Button, Checkmark } from './Form';

function Upload(props) {
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
            </div>
        </div>
    );
}

export default Upload;