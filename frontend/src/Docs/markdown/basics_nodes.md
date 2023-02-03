# Nodes

Nodes are the basic unit of operations. Every node must take an `op` attribute specifying the type of operation it carries out. Nodes can take as input the outputs of previous nodes, the root model imports, or parameters. Node tags require an `output` tag, which takes a required `name` attribute. The `name` attribute determines how that output should be referenced later in the model. Those names must be unique across a file.

Nodes require `input` and/or `params` tags. Input tags take a required `src` attribute, specifying the name of a previous node output or root level import. The `params` tag takes a required `name` attribute, speciying the unique name of the parameter, as well as a required `dim` attribute, specifying the dimensions of that parameter. The value of the `dim` attribute should be a list of tensor dimensions, with length equal to the rank of the tensor. Inputs and outputs optionally take a `dim` tag for clarity.

**Every node must be inside a block**

**Nodes must appear in the model in topologically sorted order**

Nodes also take an optional `title` attribute, which is used for visualization and as metadata in the compiled file. Here is an examble of an add node:

```
<node title="Example Add" op="Add">
    <input src="prev_output" dim="[1, 2, 3]" />
    <params name="AddParam" dim="[1]" />
    <!-- The addition is broadcasted like in numpy! -->
    <output name="add_out" dim="[1, 2, 3]" />
</node>
```