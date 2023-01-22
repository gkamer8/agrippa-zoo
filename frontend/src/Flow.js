import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css';
import dagre from 'dagre';

const initialNodes = [];

const initialEdges = [];
// const initialEdges = [];

const exampleFileText = `
<model script-version="0.0.1">

    <!-- Uses default type, which is float32 -->
    <!-- For tokens: each row is a one hot vector, sequence proceeds vertically in the matrix -->

    <import from="tokens" dim="[var(ntokens), var(nvocab)]" />
    <import from="mask" dim="[var(ntokens), var(ntokens)]" />
    <import from="posembedmatrix" dim="[var(ntokens), var(dmodel)]" />
    <import from="Embed" dim="[var(nvocab), var(dmodel)]" />
    <import from="encoder_output" dim="[var(ntokens), var(dmodel)]" />

    <!-- Shrinks tokens into dmodel using a learned embedding -->
    <block title="Embedding">
        <import from="Embed" />
        <node op="Mul" title="EmbedMul">
            <input src="Embed" />
            <params dim="[1]" name="embeddings_scale" init="constant" init_args="[var(embed_scale)]" frozen="yes" />
            <output name="embed_scaled" />
        </node>
        <node op="MatMul" title="EmbedProjection">
            <input src="tokens" />
            <input src="embed_scaled" />
            <output name="embeddings" />
        </node>
        <export from="embeddings" dim="[var(ntokens), var(dmodel)]" />
    </block>

    <block title="PositionalEmbedding">
        <import from="embeddings" />
        <import from="posembedmatrix" />
        <node op="Add">
            <input src="embeddings" />
            <input src="posembedmatrix" />
            <output name="posembeddings" />
        </node>
        <export from="posembeddings" dim="[var(ntokens), var(dmodel)]" />
    </block>

    <!-- The big decoder block -->
    <block title="DecoderLayer" rep="var(nlayers)">
        <import from="posembeddings" dim="[var(ntokens), var(dmodel)]" />

        <block title="Attention" stretch="var(nheads)">
            <import from="posembeddings" dim="[var(ntokens), var(dmodel)]" />
            <import from="mask" dim="[var(ntokens), var(ntokens)]" />
            <block title="LinearQKV">
                <import from="posembeddings" />
                <node op="MatMul">
                    <input src="posembeddings" />
                    <params name="QueryWeights" dim="[var(dmodel), var(dqueries)]" />
                    <output name="queries" dims="[var(ntokens), var(dqueries)]" />
                </node>
                <node op="MatMul">
                    <input src="posembeddings" />
                    <params name="KeyWeights" dim="[var(dmodel), var(dkeys)]" />
                    <output name="keys" dims="[var(ntokens), var(dkeys)]" />
                </node>
                <node op="MatMul">
                    <input src="posembeddings" />
                    <params name="ValueWeights" dim="[var(dmodel), var(dvalues)]" />
                    <output name="values" dim="[var(ntokens), var(dvalues)]" />
                </node>
                <export from="queries" />
                <export from="keys" />
                <export from="values" />
            </block>
            <block title="ScaledDotProductAttention">
                <import from="mask" dim="[var(ntokens), var(ntokens)]" />
                <import from="queries" />
                <import from="values" />
                <import from="keys" />
                <node op="Transpose">
                    <input src="keys" />
                    <output name="keys_t" dim="[var(dkeys), var(ntokens)]" />
                </node>
                <node op="MatMul">
                    <input src="queries" />
                    <input src="keys_t" />
                    <output name="matmul" dim="[var(ntokens), var(ntokens)]" />
                </node>
                <node op="Div">
                    <input src="matmul" />
                    <params name="scale" frozen="yes" dim="[1]" init="constant" init_args="[var(scale)]" />
                    <output name="scaled" />
                </node>
                <node title="Mask" op="Add">
                    <input src="scaled" />
                    <input src="mask" />
                    <output name="masked" />
                </node>
                <node op="Softmax" axis="-1">
                    <input src="masked" />
                    <output name="softmaxed" />
                </node>
                <node op="MatMul" title="ValueMatmul">
                    <input src="softmaxed" />
                    <input src="values" />
                    <output name="attended" dim="[var(ntokens), var(dvalues)]" />
                </node>
            </block>            
            <export from="attended" />
        </block>

        <block title="ConcatLinear">
            <import from="attended" />
            <node op="MatMul">
                <input src="attended" />
                <params name="LinearConcatW" dim="[expr(dvalues * nheads), var(dmodel)]" />
                <output name="linear_concatenated" />
            </node>
            <export from="linear_concatenated" />
        </block>
        
        <block title="Add">
            <import from="linear_concatenated" />
            <import from="posembeddings" />
            <node op="Add">
                <input src="linear_concatenated" />
                <input src="posembeddings" />
                <output name="attended_added" />
            </node>
            <export from="attended_added" />
        </block>

        <node name="LN1_Placeholder" op="Identity">
            <input src="attended_added" />
            <output name="ln1$input" />
        </node>
        <block src="layer_norm.agr" name="ln1" />

        <block title="FFN">
            <import from="ln1$layer_norm_out" />
            <node op="MatMul">
                <input src="ln1$layer_norm_out" />
                <params name="ffn_w" dim="[var(dmodel), var(dffnhidden)]" />
                <output name="ffn_projected" dim="[var(ntokens), var(dffnhidden)]" />
            </node>
            <node op="Add" title="FFNBiases" >
                <input src="ffn_projected" />
                <!-- Note that the biases are numpy style broadcasted,
                        so the FFN remains identical for each position -->
                <params name="ffn_b" dim="[var(dffnhidden)]" init="zeros" />
                <output name="ffn_biased" />
            </node>
            <node op="Relu">
                <input src="ffn_biased" />
                <output name="ffn_relu" />
            </node>
            <node op="MatMul">
                <input src="ffn_relu" />
                <params name="ffn_w2" dim="[var(dffnhidden), var(dmodel)]" />
                <output name="ffn_second_proj" />
            </node>
            <node op="Add" title="FFNBiases2">
                <input src="ffn_second_proj" />
                <params name="ffn_b2" dim="[var(dmodel)]" init="zeros" />
                <output name="ffn_out" />
            </node>
            <export from="ffn_out" />
        </block>

        <block title="Add2">
            <import from="ffn_out" />
            <import from="ln1$layer_norm_out" />
            <node op="Add">
                <input src="ffn_out" />
                <input src="ln1$layer_norm_out" />
                <output name="attended_added2" />
            </node>
            <export from="attended_added2" />
        </block>

        <node name="LN2_Placeholder" op="Identity">
            <input src="attended_added" />
            <output name="ln2$input" />
        </node>
        <block src="layer_norm.agr" name="ln2" />

        <!-- Queries come from prev layer, keys and values come from encoder -->
        <block title="CrossAttention" stretch="var(nheads)">
            <import from="ln2$layer_norm_out" dim="[var(ntokens), var(dmodel)]" />
            <import from="encoder_output" dim="[var(ntokens), var(dmodel)]" />
            <block title="LinearQKV">
                <import from="ln2$layer_norm_out" />
                <node op="MatMul">
                    <input src="ln2$layer_norm_out" />
                    <params name="QueryWeights2" dim="[var(dmodel), var(dqueries)]" />
                    <output name="queries2" dims="[var(ntokens), var(dqueries)]" />
                </node>
                <node op="MatMul">
                    <input src="encoder_output" />
                    <params name="KeyWeights2" dim="[var(dmodel), var(dkeys)]" />
                    <output name="keys2" dims="[var(ntokens), var(dkeys)]" />
                </node>
                <node op="MatMul">
                    <input src="encoder_output" />
                    <params name="ValueWeights2" dim="[var(dmodel), var(dvalues)]" />
                    <output name="values2" dim="[var(ntokens), var(dvalues)]" />
                </node>
                <export from="queries2" />
                <export from="keys2" />
                <export from="values2" />
            </block>
            <block title="ScaledDotProductAttention">
                <import from="queries2" />
                <import from="values2" />
                <import from="keys2" />
                <node op="Transpose">
                    <input src="keys2" />
                    <output name="keys_t2" dim="[var(dkeys), var(ntokens)]" />
                </node>
                <node op="MatMul">
                    <input src="queries2" />
                    <input src="keys_t2" />
                    <output name="matmul2" dim="[var(ntokens), var(ntokens)]" />
                </node>
                <node op="Div">
                    <input src="matmul2" />
                    <params name="scale2" frozen="yes" dim="[1]" init="constant" init_args="[var(scale)]" />
                    <output name="scaled2" />
                </node>
                <node op="Softmax" axis="-1">
                    <input src="scaled2" />
                    <output name="softmaxed2" />
                </node>
                <node op="MatMul" title="ValueMatmul">
                    <input src="softmaxed2" />
                    <input src="values2" />
                    <output name="attended2" dim="[var(ntokens), var(dvalues)]" />
                </node>
            </block>            
            <export from="attended2" />
        </block>

        <block title="ConcatLinear">
            <import from="attended2" />
            <node op="MatMul">
                <input src="attended2" />
                <params name="LinearConcatW2" dim="[expr(dvalues * nheads), var(dmodel)]" />
                <output name="linear_concatenated2" />
            </node>
            <export from="linear_concatenated2" />
        </block>

        <block title="Add2">
            <import from="linear_concatenated2" />
            <import from="ln2$layer_norm_out" />
            <node op="Add">
                <input src="linear_concatenated2" />
                <input src="ln2$layer_norm_out" />
                <output name="attended2_added" />
            </node>
            <export from="attended2_added" />
        </block>

        <node name="LN3_Placeholder" op="Identity">
            <input src="attended2_added" />
            <output name="ln3$input" />
        </node>
        <block src="layer_norm.agr" name="ln3" />

        <export from="ln3$layer_norm_out" />
    </block>

    <export from="ln3$layer_norm_out" dim="[var(ntokens), var(nvocab)]" />
</model>
`

function Flow(props) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [fileText] = useState(exampleFileText);
    const [details, setDetails] = useState(undefined);

    const id = props.id;
    console.log(id);

    useEffect(() => {

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

            let title = `Untitled ${el.nodeName}`;
            if (attrs['title']){
                title = attrs['title'].value;
            }

            return { id: id, position: { x: 0, y: 0 }, data: { label: title }, el: el }
        }

        // xmlDoc is a "Document" received from parser.parseFromString
        function getNodesAndEdgesFromXMLObj(modelDoc) {
    
            let inputToNode = {}  // input name -> array of block ids
            let outputFromNode = {}  // output name -> array of block ids

            let rootChildren = modelDoc.children;
            let newNodes = []
            let newEdges = []
            let k = 0;
            for (let i = 0; i < rootChildren.length; i++){
                if (rootChildren[i].nodeName === 'block' || rootChildren[i].nodeName === 'node'){
                    newNodes.push(makeNodeFromTag(rootChildren[i], k+""));
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
                    inputToNode[name] = [k+""];
                    newNodes.push(makeNodeFromTag(rootChildren[i], k+""));
                    k++;
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
                // 150 and 50 are literally just heuristics; I had a hard time figuring out how
                //  to retrieve height/width data
                g.setNode(nodes[i].id, {width: 150, height: 50});
            }
    
            for (let i = 0; i < edges.length; i++){
                g.setEdge(edges[i].source, edges[i].target);
            }
    
            dagre.layout(g);
    
            let arrangedNodes = [];
            for (let i = 0; i < nodes.length; i++){
                let newNode = Object.assign({}, nodes[i]);
                newNode.position.x = g.node(newNode.id).x;
                newNode.position.y = g.node(newNode.id).y;
                arrangedNodes.push(newNode);
            }
            return arrangedNodes;
        }

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(fileText, "text/xml");

        let modelDoc = xmlDoc.documentElement;

        let newNodesAndEdges = getNodesAndEdgesFromXMLObj(modelDoc);
        let newNodes = newNodesAndEdges[0];
        let newEdges = newNodesAndEdges[1];
        newNodes = arrangeNodes(newNodes, newEdges);
        setNodes(newNodes);
        setEdges(newEdges)
    }, [fileText, setNodes, setEdges])

    function onNodeClick(event, node){
        function makeAttrRow(attr){
            return (
                <div className='attr-row' key={attr[2]+""}>
                    <span className='attr-name'>{attr[0]}</span>: <span className='attr-value'>{attr[1]}</span>
                </div>
            );
        }

        let attrArr = []
        let attrs = node.el.attributes;
        for (var i=0; i<attrs.length; i++) {
            var attrib = attrs[i];
            // use attrib.name and attrib.value to get key value pairs
            attrArr.push([attrib.name, attrib.value, i]);
        }
        let attrMap = attrArr.map(makeAttrRow);
        let newDetails = (
            <div id="detail-attrs">
                {attrMap}
            </div>
        );
        setDetails(newDetails);
    }

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div style={{ width:'100%', height: '100%', display: 'flex'}}>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onConnect={onConnect}
            >
                <Controls />
                <Background />
            </ReactFlow>
            <div id='menu'>
                <h2>
                    Details
                </h2>
                {details}
            </div>
        </div>
    );
}

export default Flow;