import "./Form.css"
import { useState } from 'react';

export function TextInput({className, ...props}){

    className = className ? `text-bar ${className}` : 'text-bar';
    return (
        <input type="text" className={className} {...props}/>
    );
}

export function PasswordInput({className, ...props}){

    className = className ? `text-bar ${className}` : 'text-bar';
    return (
        <input type="password" className={className} {...props}/>
    );
}

export function TextBox({className, ...props}){
    className = className ? `text-box ${className}` : 'text-box';
    return (
        <textarea className={className} {...props} />
    );
}

export function Button({className, ...props}){
    className = className ? `button ${className}` : 'button';
    return (
        <input type="button" className={className} {...props} />
    );
}

export function Checkmark({className, label, ...props}){

    const [checked, setChecked] = useState(false);

    function canonClick(){
        if (checked){
            document.getElementsByClassName('check-button')[0].style.color = "#1f1f1f";
            setChecked(false);
        }
        else {
            document.getElementsByClassName('check-button')[0].style.color = "#55b13e";
            setChecked(true);
        }
        props.onClick();
    }

    className = className ? `check-option ${className}` : 'check-option';
    return (
        <div className={className}>
            <div className='check-button' onClick={canonClick}>✓</div>
            <span className='check-label' onClick={canonClick}>{label}</span>
        </div>
    )
}

export function FileUpload({className, onChange, ...props}){

    const [chosenFileNames, setChosenFileNames] = useState([]);
    function fileUploadOnChange(e){
        let fileList = e.target.files;
        let n = fileList.length;
        let newChosenFileNames = []
        for (let i = 0; i < n; i++){
            newChosenFileNames.push(fileList[i].name);
        }
        setChosenFileNames(newChosenFileNames);
        if(onChange){
            onChange(e);
        }
    }

    function makeFileNameLabel(name){
        return (
            <div className="chosen-filename" key={name}>{name}</div>
        )
    }

    const uploadedNames = chosenFileNames.length === 0 ? "No files selected." : chosenFileNames.map(makeFileNameLabel)
    return (
        <div className={className}>
            <label className='file-upload-label'>
                <input type="file" onChange={fileUploadOnChange} className="file-upload" multiple {...props} />
                Upload Files
            </label>
            <div className='file-upload-filenames'>
                {uploadedNames}
            </div>
        </div>
    )
}
