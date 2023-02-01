import './Docs.css'
import DocsMenu from './DocsMenu'
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { SECTION_MAP } from './DocsConfig'
import { useState, useEffect } from 'react';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you


function Docs(props) {

    const [mdFilepath, setMdFilepath] = useState("./markdown/main.md");
    const [opened, setOpened] = useState([]);
    const [mdText, setMdText] = useState("");
    const [final, setFinal] = useState(false);

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
        if (final){
            getFile();
        }
    }, [mdFilepath, final]);

    useEffect(() => {
        let newOpened = []  // list of max length 3: [section id, subsection id, subsubsection id]

        if (section){
            newOpened.push(section);
            if (subsection){
                newOpened.push(subsection);
                if (subsubsection){
                    newOpened.push(subsubsection);
                }
            }
        }

        let openedTriple = SECTION_MAP
        for (let i = 0; i < newOpened.length; i++){
            openedTriple = openedTriple[2][newOpened[i]]
        }
        setMdFilepath("./markdown/" + openedTriple[1]);
        setFinal(true);
        setOpened(newOpened);
    }, [setMdFilepath, setOpened, setFinal, section, subsection, subsubsection])

    return (
        <div style={{'display': 'flex'}}>
            <div style={{'minWidth': '20%'}}>
                <DocsMenu opened={opened} />
            </div>
            <div className='md-container'>
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}>
                    
                    {mdText}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default Docs;