import { TextInput, Checkmark } from "./Form";
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import './ModelTable.css'


// Needs to have a *props.contents* list that defines the contents of the table
function SearchableTable(props) {

    const origModels = props.content;
    
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

    // TODO: allow for arbitrary rows determined from parent
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

    const listItems = models.map(makeSquare);
    return (
        <div>
            <TextInput className={'search-bar'} onChange={handleSearchTextChange} placeholder="Search..." />
            <Checkmark onClick={canonChange} label="Canonical" />
            <table className='model-table'>
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Author
                        </th>
                        <th>
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody>{listItems}</tbody>
            </table>
        </div>
    )
}

export default SearchableTable;