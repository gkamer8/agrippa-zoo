import './DocsMenu.css'
import { SECTION_MAP } from './DocsConfig'
import { Link } from 'react-router-dom'
import DocsSearch from './DocsSearch'
import { useState } from 'react';

function DocsMenu(props){

    const [searchTerm, setSearchTerm] = useState('');

    // When you click a link in the menu, call the callback function thats passed to the search feature so the search value updates
    const updateSearchTerm = (term) => {
        setSearchTerm(term);
    };

    function makeMenuOption(lst){
        let subsections = lst[2]
        if (!subsections){
            return "";
        }

        function makeLink(entry){
            let id = entry[0]
            let name = entry[1][0]

            if (Object.keys(entry[1][2]).length !== 0){

                let newlinks = []
                let sublinks = entry[1][2]
                for (const [key, value] of Object.entries(sublinks)) {
                    newlinks.push([key, value, `${entry[2]}/${id}`])
                }

                newlinks = newlinks.map(makeLink);

                let startingDisplay = "none";
                if (props.opened.includes(id)){
                    startingDisplay = "block";
                }

                return (
                    <div key={id}>
                        <div className='menu-entry'>
                            <Link onClick={() => updateSearchTerm(name)} to={`${entry[2]}/${id}`}>{name}</Link>
                        </div>
                        <div className='section' id={id+"-section"} style={{'display': startingDisplay}}>
                            {newlinks}
                        </div>
                    </div>
                )
            }
            return (
                <div className='menu-entry' key={name}>
                    <Link onClick={() => updateSearchTerm(name)} to={`${entry[2]}/${id}`}>{name}</Link>
                </div>
            )
        }

        let entries = []
        for (const [key, value] of Object.entries(subsections)) {
            entries.push([key, value, "/Docs"])
        }
        let links = entries.map(makeLink);
        return (
            <div>
                {links}
            </div>
        )
    }

    let menuOptions = makeMenuOption(SECTION_MAP);


    return (
        <div id="docs-menu-container">
            <DocsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <h3>
                <Link to="/Docs">
                    Menu
                </Link>
            </h3>
            {menuOptions}
        </div>
    )
}

export default DocsMenu;