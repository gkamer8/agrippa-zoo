import { BACKEND_URL } from './Api';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Model.css';
import ReactMarkdown from 'react-markdown'


function Model(){

    const [modelInfo, setModelInfo] = useState({});
    const [modelLoadFailed, setModelLoadFailed] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);

    const [modelReadme, setModelReadme] = useState("");
    const [modelReadmeLoadFailed, setModelReadmeLoadFailed] = useState(false);
    const [modelReadmeLoaded, setModelReadmeLoaded] = useState(false);

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
        async function getReadme(){
            let url = BACKEND_URL + "download/readme?id=" + id;
            console.log(url)
            try {
                const response = await fetch(url);
                const myStr = await response.text(); //extract JSON from the http response
            
                setModelReadme(myStr);
                setModelReadmeLoaded(true);
            } 
            catch (error) {
                console.error(error);
                setModelReadmeLoadFailed(true);
            }
        }
        if (modelLoaded === false){
            getModel();
        }
        if (modelReadmeLoaded === false){
            getReadme();
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
        let md_text = modelReadme;

        let readme_header = "";

        // if we're waiting for it to load or it's loaded
        if(modelReadmeLoaded && md_text != ""){
            readme_header = (
                <div className='readme-header'>README.md</div>
            );
        }
        
        return (
            <div className='content-container'>
                <div className='model_card'>
                    <h1 className='model_name'>
                        {model_name}
                    </h1>
                    <div>
                        Author: <span className='author'>{model_author}</span>
                    </div>
                    <div className='download-block'>
                        <a href={BACKEND_URL + "download/markup?download=1&id=" + id} download={true}>
                            <span className='download-text'>Download Markup</span>
                        </a>
                    </div>
                    <div className='short_desc'>{short_desc}</div>
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