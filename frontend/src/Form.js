import "./Form.css"

export function TextInput({className, ...props}){

    className = className ? `text-bar ${className}` : 'text-bar';
    return (
        <input type="text" className={className} {...props}/>
    );
}

export function TextBox({className, ...props}){
    className = className ? `text-box ${className}` : 'text-box';
    return (
        <textarea type="text" className={className} {...props} />
    );
}
