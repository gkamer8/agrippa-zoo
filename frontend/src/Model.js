import { BACKEND_URL } from './Api';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Model.css';

function Model(){

    const [modelInfo, setModelInfo] = useState({});
    const [modelLoadFailed, setModelLoadFailed] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);

    let { id } = useParams();

    useEffect(() => {
        async function getModel(){
            let url = BACKEND_URL + "info/model?id=" + id;
            console.log(url)
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
        if (modelLoaded === false){
            getModel();
        }
    })

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
        let model_name = modelInfo['name']
        let model_author = modelInfo['author_name']
        let short_desc = modelInfo['short_desc']
        return (
            <div>
                <div className='model_card'>
                    <div className='model_name'>{model_name}</div>
                    <div className='author'>{model_author}</div>
                    <div className='short_desc'>{short_desc}</div>
                    <a href={BACKEND_URL + "download/markup?download=1&id=" + id} download={true}>Download Markup</a>
                </div>
            </div>
        )
    }

}

export default Model;