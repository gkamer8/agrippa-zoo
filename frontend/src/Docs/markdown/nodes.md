# Nodes

Nodes are how you define operations. They take a required "op" attribute, which can be set to "Add", "MatMul", or any of the various operations specified in the documentation under "Node Ops". They may also take a "title" attribute.

Sometimes particular operations require additional attributes; for example a "Concat" operation requires the "axis" attribute.

Every node must be placed inside a block. Nodes must contain an `<output name="..."/>` tag as a child, which has a required "name" attribute and suggested "dims" attribute. Nodes must also contain some input; those can be specified either with a params tag as in `<params name="..." dims="..."/>` or an input tag as in `<input name="..."/>` The order of the parameters and inputs is respected.

Here is how a block performing a linear regression might look:

```
<block title="Linear">
    <node op="Mul" title="Apply Betas">
        <params name="W" dims="[var(n)]" />
        <input src="x" />
        <output name="wx" />
    </node>
    <node op="Add" title="Apply Biases">
        <params name="b" dims="[1]" />
        <input src="wx" />
        <ouptut name="y" />
    </node>
</block>
```
