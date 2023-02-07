import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css';
import dagre from 'dagre';

const initialNodes = [];

const initialEdges = [];
// const initialEdges = [];

function Flow(props) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [details, setDetails] = useState(undefined);
    const [modelDoc, setModelDoc] = useState(undefined);
    const [detailsClosed, setDetailsClosed] = useState(true);

    const fileText = props.fileText;
    // const id = props.id;

    const { fitView } = useReactFlow();

    useEffect(() => {

        // xmlDoc is a "Document" received from parser.parseFromString
        function getNodesAndEdgesFromXMLObj(modelDoc) {

            function isSourcedBlock(el){
                return el.nodeName === 'block' && el.attributes['src'];
            }

            // given an input src/output name, return the name of the block if it's sourced
            // otherwise, return null
            function getSourceName(name){
                let dollarIndex = name.indexOf("$");
                if (dollarIndex === -1) {
                    return undefined;
                }
                return name.slice(0, dollarIndex);
            }

            // type is input or output
            function makeNodeFromMissing(name, type, id) {
                let properClass = type === 'input' ? 'import-node' : 'export-node'
                return { id: id, className: properClass, position: { x: 0, y: 0 }, data: { label: name }, type: type }
            }

            function makeNodeFromTag(el, id) {
                let attrs = el.attributes;
                
                if (el.nodeName === 'import'){
                    let name = attrs['from'].value;
                    return { id: id, className: "import-node", position: { x: 0, y: 0 }, data: { label: name }, type: 'input', el: el }
                }
                else if (el.nodeName === 'export'){
                    let name = attrs['from'].value;
                    return { id: id, className: "export-node", position: { x: 0, y: 0 }, data: { label: name }, type: 'output', el: el }
                }

                if (isSourcedBlock(el)){
                    let title = attrs['title'] ? attrs['title'].value : attrs['name'].value
                    return { id: id, className: "sourced-node", position: { x: 0, y: 0 }, data: { label: title }, el: el }
                }
    
                let title = el.nodeName === 'block' ? `Untitled ${el.nodeName}` : attrs['op'].value;
                if (attrs['title']){
                    title = attrs['title'].value;
                }
    
                return { id: id, className: "regular-node", position: { x: 0, y: 0 }, data: { label: title }, el: el }
            }
    
            let inputToNode = {}  // input name -> array of block ids
            let outputFromNode = {}  // output name -> array of block ids

            let rootChildren = modelDoc.children;
            let newNodes = []
            let newEdges = []
            let sourcedNames = []
            let sourcedIds = []
            let internalSources = [];
            let k = 0;  // this should always match up with i; for dumb reasons it's a separate var
            for (let i = 0; i < rootChildren.length; i++){
                if (rootChildren[i].nodeName === 'block' || rootChildren[i].nodeName === 'node'){
                    newNodes.push(makeNodeFromTag(rootChildren[i], k+""));

                    // if it's a sourced block, add its name to sourcedNames and id to sourcedIds
                    if (isSourcedBlock(rootChildren[i])){
                        sourcedNames.push(rootChildren[i].attributes['name'].value);
                        sourcedIds.push(k+"");
                    }

                    // Go through child blocks and find if any are source blocks
                    // If so, add to internal sources so we can remove their inputs/outputs
                    let childBlocks = rootChildren[i].querySelectorAll("*>block");
                    for (let j = 0; j < childBlocks.length; j++){
                        if (isSourcedBlock(childBlocks[j])){
                            internalSources.push(childBlocks[j].attributes['name'].value);
                        }
                    }
                    // Find input and output names and add to inputToNode, outputFromNode dicts
                    let inputs = rootChildren[i].querySelectorAll("*>input");
                    for (let j = 0; j < inputs.length; j++){
                        let src = inputs[j].attributes['src'].value;
                        if (inputToNode[src]){
                            if (!inputToNode[src].includes(k+"")){
                                inputToNode[src].push(k+"");
                            }
                        }
                        else {
                            inputToNode[src] = [k+""];
                        }
                    }
                    let outputs = rootChildren[i].querySelectorAll("*>output");
                    for (let j = 0; j < outputs.length; j++){
                        let src = outputs[j].attributes['name'].value;
                        // Note: output names should be unique, so everything should go to the 'else' block
                        //      both blocks included now just in case that becomes not true in the future
                        if (outputFromNode[src]){
                            if (!outputFromNode[src].includes(k+"")){
                                outputFromNode[src].push(k+"");
                            }
                        }
                        else {
                            outputFromNode[src] = [k+""];
                        }
                    }

                    // Also grab exports for good measure; these will be repeats except for sourced blocks,
                    //  ... for now
                    let exports = rootChildren[i].querySelectorAll("*>export");
                    for (let j = 0; j < exports.length; j++){
                        let src = exports[j].attributes['from'].value;
                        // Note: output names should be unique, so everything should go to the 'else' block
                        //      both blocks included now just in case that becomes not true in the future
                        if (outputFromNode[src]){
                            if (!outputFromNode[src].includes(k+"")){
                                outputFromNode[src].push(k+"");
                            }
                        }
                        else {
                            outputFromNode[src] = [k+""];
                        }
                    }
                    k++;
                }
                else if (rootChildren[i].nodeName === 'import'){
                    let name = rootChildren[i].attributes['from'].value;
                    outputFromNode[name] = [k+""];
                    newNodes.push(makeNodeFromTag(rootChildren[i], k+""));
                    k++;
                }
                else if (rootChildren[i].nodeName === 'export'){
                    let name = rootChildren[i].attributes['from'].value;
                    if (inputToNode[name]){
                        if (!inputToNode[name].includes(k+"")){
                            inputToNode[name].push(k+"");
                        }
                    }
                    else {
                        inputToNode[name] = [k+""];
                    }
                    newNodes.push(makeNodeFromTag(rootChildren[i], k+""));
                    k++;
                }
            }

            // Go through sourced ids, add appropriate inputs and outputs
            for(let i = 0; i < sourcedIds.length; i++){
                let id = sourcedIds[i];
                for (const key in outputFromNode) {
                    let sn = getSourceName(key);
                    if (sn !== sourcedNames[i]){
                        continue;
                    }
                    if (inputToNode[key]){
                        if (!inputToNode[key].includes(id)){
                            inputToNode[key].push(id);
                        }
                    }
                    else {
                        inputToNode[key] = [id];
                    }
                }
                for (const key in inputToNode) {
                    let sn = getSourceName(key);
                    if (sn !== sourcedNames[i]){
                        continue;
                    }
                    if (outputFromNode[key]){
                        if (!outputFromNode[key].includes(id)){
                            outputFromNode[key].push(id);
                        }
                    }
                    else {
                        outputFromNode[key] = [id];
                    }
                }
            }

            // If there are still missing outputs/inputs with missing inputs/outputs, add them as nodes and make the proper connections
            // Unless they are caused by interalized sourced blocks!
            for (const key in outputFromNode) {
                if (!inputToNode[key]){
                    if (internalSources.indexOf(getSourceName(key)) !== -1){
                        continue;
                    }
                    let id = newNodes.length+"";
                    newNodes.push(makeNodeFromMissing(key, 'output', id));
                    for(let i = 0; i < outputFromNode[key].length; i++){
                        if (inputToNode[key]){
                            if (!inputToNode[key].includes(id)){
                                inputToNode[key].push(id);
                            }
                        }
                        else {
                            inputToNode[key] = [id];
                        }
                    }
                }
            }
            for (const key in inputToNode) {
                if (!outputFromNode[key]){
                    if (internalSources.indexOf(getSourceName(key)) !== -1){
                        continue;
                    }
                    let id = newNodes.length+"";
                    newNodes.push(makeNodeFromMissing(key, 'input', id));
                    for(let i = 0; i < inputToNode[key].length; i++){
                        if (outputFromNode[key]){
                            if (!outputFromNode[key].includes(id)){
                                outputFromNode[key].push(id);
                            }
                        }
                        else {
                            outputFromNode[key] = [id];
                        }
                    }
                }
            }

            // Go through outputs, make edges from output block to all blocks with that input
            let existingEdges = {} // dictionary of "id->id"->true
            for (const key in outputFromNode) {
                if (inputToNode[key]){
                    let outputs = outputFromNode[key];
                    for (let i = 0; i < outputs.length; i++){
                        let inputs = inputToNode[key];
                        for (let k = 0; k < inputs.length; k++){
                            let arrowStr = outputs[i]+"->"+inputs[k];
                            if (!existingEdges[arrowStr] && outputs[i] !== inputs[k]){
                                let newEdge = { id: arrowStr, source: outputs[i], target: inputs[k] };
                                newEdges.push(newEdge);
                                existingEdges[arrowStr] = true;
                            }
                        }
                    }
                }
            }

            return [newNodes, newEdges];
        }

        function arrangeNodes(nodes, edges){
            let g = new dagre.graphlib.Graph();
            g.setGraph({});
            g.setDefaultEdgeLabel(function() { return {}; });
            for (let i = 0; i < nodes.length; i++){
                // This is a heuristic to figure out the rendered widths of the nodes
                // This is the reason we choose a monospace font for the labels
                // It's pretty dumb; can you figure out a better way?
                let lab = nodes[i].data.label
                let labLen = lab.length;
                console.log(labLen)
                let newWidth = 20 + labLen * 7.15;  // 20 for the padding
                newWidth = 150 > newWidth ? 150 : newWidth; 
                g.setNode(nodes[i].id, {width: newWidth, height: 50});
            }
    
            for (let i = 0; i < edges.length; i++){
                g.setEdge(edges[i].source, edges[i].target);
            }
    
            dagre.layout(g);
    
            let arrangedNodes = [];
            for (let i = 0; i < nodes.length; i++){
                let newNode = Object.assign({}, nodes[i]);
                newNode.position.x = g.node(newNode.id).x - g.node(newNode.id).width / 2;
                newNode.position.y = g.node(newNode.id).y;
                newNode.style = {'width': g.node(newNode.id).width}
                arrangedNodes.push(newNode);
            }
            return arrangedNodes;
        }


        if (modelDoc === undefined){
            return;
        }

        let newNodesAndEdges = getNodesAndEdgesFromXMLObj(modelDoc);
        let newNodes = newNodesAndEdges[0];
        let newEdges = newNodesAndEdges[1];
        newNodes = arrangeNodes(newNodes, newEdges);
        setNodes(newNodes);
        setEdges(newEdges);

        // fitView();  // seems to work only sometimes? to investigate.
    }, [setNodes, setEdges, modelDoc, fitView]);


    useEffect(() => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(fileText, "text/xml");

        setModelDoc(xmlDoc.documentElement);
    }, [fileText]);

    function onNodeClick(event, node){
        function makeAttrRow(attr){
            return (
                <div className='attr-row' key={attr[2]+""}>
                    <span className='attr-name'>{attr[0]}</span>: <span className='attr-value'>{attr[1]}</span>
                </div>
            );
        }

        let attrArr = []

        // tag name
        attrArr.push(['tag', node.el.nodeName, attrArr.length]);

        let attrs = node.el.attributes;
        for (let i=0; i<attrs.length; i++) {
            let attrib = attrs[i];
            // use attrib.name and attrib.value to get key value pairs
            attrArr.push([attrib.name, attrib.value, i]);
        }

        // For nodes, add their inputs/outputs/parameters
        // note that we don't need to check, since only nodes have those things as first children
        for (let i = 0; i < node.el.children.length; i++){
            if (node.el.children[i].nodeName === 'input'){
                attrArr.push(['input', node.el.children[i].attributes['src'].value, attrArr.length])
            }
            else if (node.el.children[i].nodeName === 'output'){
                attrArr.push(['output', node.el.children[i].attributes['name'].value, attrArr.length])
            }
            else if (node.el.children[i].nodeName === 'params'){
                attrArr.push(['params', node.el.children[i].attributes['name'].value, attrArr.length])
            }
        }

        let attrMap = attrArr.map(makeAttrRow);
        let newDetails = (
            <div id="detail-attrs">
                {attrMap}
            </div>
        );
        setDetails(newDetails);
        setDetailsClosed(false);
    }

    function goToParent(){
        if (modelDoc){
            setModelDoc(modelDoc.parentNode);
        }
    }

    let focusedNodeControl = "";
    // This is a bit hacky - the root of the file's parent is a document, not null
    // but that document's parent is null - so we don't show a Back button if the parent of the parent of the element is null
    if (modelDoc && modelDoc.parentNode.parentNode === null){
        focusedNodeControl = "";
    }
    else {
        focusedNodeControl = (
            <div onClick={goToParent} className='focused-node-control'>
                {"<< Back"}
            </div>
        )
    }

    function onNodeDoubleClick(event, node){
        let el = node.el;
        setDetailsClosed(true);
        if (el.nodeName === 'block' && el.attributes['src']){
            props.onSourcedClick(el.attributes['src'].value);
            return;
        }
        if (el.nodeName === 'block'){
            setModelDoc(node.el);
        }
        else {
            return;
        }
    }

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    
    function closeDetails(){
        setDetailsClosed(true);
    }

    let detailsMenu = "";
    if (!detailsClosed){
        detailsMenu = (
            <div id='menu'>
                <span onClick={closeDetails} className="details-close-button">Close</span>
                <h2>
                    Details
                </h2>
                {details}
            </div>
        )
    }

    const [MousePosition, setMousePosition] = useState({
        left: 0,
        top: 0
    })

    function handleMouseMove(ev){
        setMousePosition({left: ev.pageX, top: ev.pageY});
    }

    function resizeMouseMove(ev, resizer, leftSide, rightSide, left, top, leftWidth){

        const dx = ev.clientX - left;
        const dy = ev.clientY - top;

        const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.width = `${newLeftWidth}%`;

        resizer.style.cursor = 'col-resize';
        document.body.style.cursor = 'col-resize';
    }

    function resizeMouseUp(ev, moveWrap, upWrap){
        document.removeEventListener('mousemove', moveWrap);
        document.removeEventListener('mouseup', upWrap);

        document.body.style.cursor = 'unset';
    }

    function resizeMouseDown(ev){
        const resizer = document.getElementById('dragMe');
        const leftSide = resizer.previousElementSibling;
        const rightSide = resizer.nextElementSibling;

        const leftWidth = leftSide.getBoundingClientRect().width;

        function moveWrap(ev){
            resizeMouseMove(ev, resizer, leftSide, rightSide, MousePosition.left, MousePosition.top, leftWidth)
        }

        function upWrap(ev){
            resizeMouseUp(ev, moveWrap, upWrap)
        }

        document.addEventListener("mousemove", moveWrap);
        document.addEventListener("mouseup", upWrap);

    }

    return (
        <div onMouseMove={(ev)=> handleMouseMove(ev)}
             style={{ width:'100%', height: '100%', display: 'flex'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onConnect={onConnect}
                onNodeDoubleClick={onNodeDoubleClick}
                fitView  // necessary for flow to call fitView
            >
                <Controls />
                <Background />
                <Panel position='top-right'>
                    {focusedNodeControl}
                </Panel>
            </ReactFlow>
            <div onMouseDown={resizeMouseDown} className="resizer" id="dragMe"></div>
            {detailsMenu}
        </div>
    );
}

export default Flow;