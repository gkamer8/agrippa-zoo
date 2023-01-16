import './ModelBoard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { BACKEND_URL } from './Api.js'

function ModelBoard(props){

    const [origModels, setOrigModels] = useState([]);
    const [models, setModels] = useState([]);
    const [modelsLoadFailed, setModelsLoadFailed] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {

        async function getModels() {
            console.log("Getting models")
            let url = BACKEND_URL + "info/manifest"
            try {
                const response = await fetch(url);
                const myJson = await response.json(); //extract JSON from the http response
            
                // "Cannot modify state directly", hence setState
                setModelsLoaded(true);
                setModels(myJson);
                setOrigModels(myJson);
            } 
            catch (error) {
                console.error(error);
                setModelsLoadFailed(true);
            }
        }

        if (modelsLoaded === false){
            getModels();
        }

    }, [modelsLoaded]);

    useEffect(() => {
        if (searchText !== ""){
            let newModels = origModels.filter(function(model) {
                return model.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
            });
            setModels(newModels);
        }
        else {
            setModels(origModels);
        }
    }, [searchText, origModels]);

    function makeSquare(item) {
        let url = "/model/" + item.id
        // Note that the link is used instead of some onclick because props/state is hard
        return (
            <tr key={item.id}>
                <td className='model-name'>
                    <Link to={url} key={item.id}>
                        {item.name}
                    </Link>
                </td>
                <td>
                    {item.author_name}
                </td>
                <td>
                    {item.short_desc}
                </td>
            </tr>
        );
    }

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    }

    if (modelsLoaded === 0 && modelsLoadFailed === false){
        return (
            <div>Loading squares...</div>
        )
    }
    else if (modelsLoadFailed === true){
        return (
            <div>Squares failed to load. Try again.</div>
        )
    }
    else{
        const listItems = models.map(makeSquare);
        return (
            <div className='content-container'>
                <div className='table-container'>
                    <input type={"text"} onChange={handleSearchTextChange} placeholder="Search..." className="search-bar" />
                    <br/><br/>
                    <table className='model-table'>
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Author</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>{listItems}</tbody>
                    </table>
                </div>
            </div>
        )
    }

}

export default ModelBoard;
