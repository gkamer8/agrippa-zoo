import { TextInput, Checkmark } from "./Form";
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import './ModelTable.css'


// Needs to have a *props.contents* list that defines the contents of the table
// ... as well as a *props.headers* list defining the table headers
function SearchableTable(props) {

    const origModels = props.contents;
    const headers = props.headers;
    
    const [models, setModels] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [canonChecked, setCanonChecked] = useState(false);

    useEffect(() => {
        if (searchText !== ""){
            let newModels = origModels.filter(function(model) {
                return model.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
            });

            if (canonChecked){
                newModels = newModels.filter(function(model) {
                    return model.canonical;
                });
            }

            setModels(newModels);
        }
        else {
            let newModels = origModels;
            if (canonChecked){
                newModels = newModels.filter(function(model) {
                    return model.canonical;
                });
            }
            setModels(newModels);
        }
    }, [searchText, origModels, canonChecked]);


    function makeSquare(item) {
        let url = "/model/" + item.id
        let canon = item.canonical ? (<div className='canon'>✓</div>) : ("");
        // Note that the link is used instead of some onclick because props/state is hard
        return (
            <tr key={item.id}>
                <td>
                    <div className='model-name'>
                        <Link to={url} key={item.id}>
                            {item.name}
                        </Link>
                    </div>
                    {canon}
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

    const canonChange = (event) => {
        setCanonChecked(!canonChecked);
    }

    function makeHeader(header) {
        return (
            <th key={header}>
                {header}
            </th>
        );
    }

    const listItems = models.map(makeSquare);
    const headersList = headers.map(makeHeader);
    return (
        <div>
            <TextInput className={'search-bar'} onChange={handleSearchTextChange} placeholder="Search..." />
            <Checkmark onClick={canonChange} label="Canonical" />
            <table className='model-table'>
                <thead>
                    <tr>
                        {headersList}
                    </tr>
                </thead>
                <tbody>{listItems}</tbody>
            </table>
        </div>
    )
}

export default SearchableTable;