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

export function Checkmark({className, label, startChecked, ...props}){

    const [checked, setChecked] = useState(startChecked);
    let startColor = startChecked ? "#55b13e" : "#1f1f1f";
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
            <div className='check-button' style={{'color': startColor}} onClick={canonClick}>✓</div>
            <span className='check-label' onClick={canonClick}>{label}</span>
        </div>
    )
}

export function FileUpload({className, onChange, buttonClassName, value, ...props}){

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

    buttonClassName = buttonClassName ? "file-upload-label " + buttonClassName : "file-upload-label"; 

    let buttonText = value ? value : "Upload Files"

    const uploadedNames = chosenFileNames.length === 0 ? "No files selected." : chosenFileNames.map(makeFileNameLabel)
    return (
        <div className={className}>
            <label className={buttonClassName}>
                <input type="file" onChange={fileUploadOnChange} className="file-upload" multiple {...props} />
                {buttonText}
            </label>
            <div className='file-upload-filenames'>
                {uploadedNames}
            </div>
        </div>
    )
}
