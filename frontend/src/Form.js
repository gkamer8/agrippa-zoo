import "./Form.css"
import { useState, useEffect } from 'react';

export function TextInput({className, ...props}){

    className = className ? `text-bar ${className}` : 'text-bar';
    return (
        <input type="text" className={className} {...props}/>
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
            document.getElementsByClassName('canon-button')[0].style.color = "#1f1f1f";
            setChecked(false);
        }
        else {
            document.getElementsByClassName('canon-button')[0].style.color = "#55b13e";
            setChecked(true);
        }
        props.onClick();
    }

    className = className ? `canonical-option ${className}` : 'canonical-option';
    return (
        <div className={className}>
            <div className='canon-button' onClick={canonClick}>✓</div>
            <span className='canon-label' onClick={canonClick}>{label}</span>
        </div>
    )
}
