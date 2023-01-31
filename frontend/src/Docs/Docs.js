import './Docs.css'
import DocsMenu from './DocsMenu'
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { SECTION_MAP } from './DocsConfig'
import { useState, useEffect } from 'react';

function Docs(props) {

    const [mdFilepath, setMdFilepath] = useState("./markdown/main.md");
    const [opened, setOpened] = useState([]);
    const [mdText, setMdText] = useState("");

    let { section, subsection, subsubsection } = useParams();

    useEffect(() => {
        async function getFile(){
            // oh boy is `${asdf}` hacky - otherwise you get "Critical dependency: the request of a dependency is an expression"
            let f = await import(`${mdFilepath}`)
            fetch(f.default)
                .then((response) => response.text())
                .then((textContent) => {
                setMdText(textContent);
            });
        }
        getFile();
    }, [mdFilepath]);

    useEffect(() => {
        let newOpened = []  // list of max length 3: [section id, subsection id, subsubsection id]

        if (section){
            newOpened.push(section)
            if (subsection){
                newOpened.push(subsection)
                if (subsubsection){
                    newOpened.push(subsubsection)
                }
            }
        }

        let openedTriple = SECTION_MAP
        for (let i = 0; i < newOpened.length; i++){
            openedTriple = openedTriple[2][newOpened[i]]
        }
        setMdFilepath("./markdown/" + openedTriple[1])

        setOpened(newOpened)
    }, [setMdFilepath, setOpened, section, subsection, subsubsection])

    return (
        <div style={{'display': 'flex'}}>
            <div>
                <DocsMenu opened={opened} />
            </div>
            <div style={{'padding': '2em', 'textAlign': 'left'}}>
                <ReactMarkdown>
                    {mdText}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default Docs;