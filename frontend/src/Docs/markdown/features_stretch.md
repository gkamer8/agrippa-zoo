# Stretch

By specifying the `stretch` attribute, you tell the compiler to repeat a block horizontally. What's meant is that the inputs for each "version" of the block are the same, and the outputs are automatically concatenated together. In the ONNX file, an extra Concat node will appear. The parameters are not, by default, shared.

It is critical that you use `import` and `export` tags to specify which inputs should be fed into the stretched blocks and which outputs should be concatenated together. Each export is concatenated separately, and you can refer to the concatenated output using the same name as you used in the export (that is, the `from` attribute, which should match the name of the relevant node output).

**It is illegal to use the stretch and rep attributes together.**

Here is a section of a transformer model in which a stretch is used. The Attention block is repeated `var(nheads)` many times, and the concatenated outputs of those blocks are fed into a linear transformation:

```
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
```