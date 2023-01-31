import './DocsMenu.css'
import { SECTION_MAP } from './DocsConfig'
import { Link } from 'react-router-dom'

function DocsMenu(props){

    function makeMenuOption(lst){
        let subsections = lst[2]
        if (!subsections){
            return "";
        }

        function makeLink(entry){
            let id = entry[0]
            let name = entry[1][0]

            function openSubsection(id){
                if (document.getElementById(id+"-section").style.display === 'block'){
                    document.getElementById(id+"-section").style.display = 'none';
                }
                else{
                    document.getElementById(id+"-section").style.display = 'block';
                }
            }

            if (Object.keys(entry[1][2]).length !== 0){

                let newlinks = []
                let sublinks = entry[1][2]
                for (const [key, value] of Object.entries(sublinks)) {
                    newlinks.push([key, value, `${entry[2]}/${id}`])
                }

                newlinks = newlinks.map(makeLink);

                return (
                    <div>
                        <div className='menu-entry' onClick={() => {openSubsection(id)}}>
                            <Link to={`${entry[2]}/${id}`}>{name}</Link>
                        </div>
                        <div className='section' id={id+"-section"} style={{'display': 'none'}}>
                            {newlinks}
                        </div>
                    </div>
                )
            }
            return (
                <div className='menu-entry'>
                    <Link to={`${entry[2]}/${id}`}>{name}</Link>
                </div>
            )
        }

        let entries = []
        for (const [key, value] of Object.entries(subsections)) {
            entries.push([key, value, "/Docs"])
        }
        console.log(entries)
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