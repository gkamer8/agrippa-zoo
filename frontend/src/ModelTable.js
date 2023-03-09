import { TextInput, Checkmark, Button } from "./Form";
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import './ModelTable.css'


// Needs to have a *props.contents* list that defines the contents of the table
function SearchableTable(props) {

    const origModels = props.content;
    const maxRows = props.maxRows;
    
    const [models, setModels] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [canonChecked, setCanonChecked] = useState(false);
    const [curPage, setCurPage] = useState(1);

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
        let url = "/model/" + item.id;
        let canon = item.canonical ? (<div className='canon'>✓</div>) : ("");

        /*
        // I didn't really like how the tags functioned
        // For one, they make the table too big on mobile.
        function makeTag(tag){
            return (
                <div className="model-table-tag" key={tag}>
                    {tag}
                </div>
            )
        }

        let tags = JSON.parse(item.tags);
        let inputs = tags["input"] ? tags["input"] : [];
        let outputs = tags["output"] ? tags["output"] : [];

        let inputTags = inputs.map(makeTag);
        let outputTags = outputs.map(makeTag);
        */
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

    function pageCallback(page){
        setCurPage(page)
    }

    function makePageSelector(page){
        let txt = page
        if (page === curPage){
            txt = <span style={{'textDecoration': 'underline'}}>{page}</span>
        }
        return (
            <span onClick={() => pageCallback(page)} className="table-page-selector">
                {txt}
            </span>
        )
    }

    function getNumPages(){
        return Math.ceil(models.length / maxRows)
    }

    function advancePage(){
        if (curPage < getNumPages()){
            setCurPage(curPage + 1)
        }
    }

    let curPageModels = models;

    let pageSelectors = ""
    if (maxRows && getNumPages() > 1){

        let pageList = [...Array(getNumPages()).keys()].map(i => i + 1).map(makePageSelector);
        curPageModels = curPageModels.slice((curPage - 1) * maxRows, curPage * maxRows);
        pageSelectors = (
            <React.Fragment>
                <Button value="Next" className="model-table-pages-next" onClick={advancePage} />
                {pageList}
            </React.Fragment>
        )
    }
    
    const listItems = curPageModels.map(makeSquare);

    return (
        <div className="model-table-container">
            <div className={'search-bar'}>
                <TextInput onChange={handleSearchTextChange} placeholder="Search..." />
            </div>
            <Checkmark onClick={canonChange} label="Canonical" />
            <table className='model-table'>
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody>{listItems}</tbody>
            </table>
            <div className="model-table-pages">
                {pageSelectors}
            </div>
        </div>
    )
}

export default SearchableTable;