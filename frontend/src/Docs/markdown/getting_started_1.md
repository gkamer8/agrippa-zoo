# Creating a Project

First, we must create a project folder for our model, which we'll call `lin-reg`. Inside the project directory, add a file called `main.agr`. This will be the index file (main file) of our project.

Note that you might want to enable XML syntax highlighting for files with a `.agr` extension. In VSCode, you can place the following code inside a `settings.json` file:

```
"files.associations": {
    "*.agr": "xml"
}
```

The `settings.json` file can be opened using `CTRL-SHIFT-P`, typing `settings.json`, and choosing the appropriate option.

Inside `main.agr`, we can start by creating the root `model` element:

```
<model>
    <!-- All models have one outer level model tag -->
</model>
```

First, we should define our root level imports and exports - the inputs and outputs of our entire model. These `import` and `export` tags must include a `dim` attribute, defining the tensor's dimensions, as well as `from` attributes, which specify how we should refer to these tensors.

Inside `dim`, we will use the expression `var(n)` to refer to the size of our input and output vectors. The `var` operator allows us to change the size of this dimension programatically when we export the model into ONNX from Python.

```
<model>
    <import from="x" dim="[var(n)]" />
    <!-- The rest of the model will go here -->
    <export from="y" dim="[var(n)]" />
</model>
```

Next, we will create a "Linear" block, where our linear transformation will go.

All computation is done inside `node` tags. All nodes must be placed inside a block. Node tags have a required `op` attribute; the allowed operations are listed elsewhere in the documentation. Here, we will use elementwise multiplication (`Mul`) to multiply our input vector by our betas, which are learned parameters.

```
<model>
    <import from="x" dim="[var(n)]" />
    <block title="Linear">
        <node op="Mul" title="Apply Betas">
            <params name="W" dim="[var(n)]" />
            <input src="x" />
            <output name="wx" />
        </node>
    </block>
    <export from="y" dim="[var(n)]" />
</model>
```

The `params` tag specifies parameters and take required `name` and `dim` attributes. The `input` tag is what we use inside nodes (as opposed to `import`, which has a subtly different function). The `input` tag takes a required `src` attribute, which defines its source. Next, we can apply the biases in the same way using the `Add` operation.

```
<model>
    <import from="x" dim="[var(n)]" />
    <block title="Linear">
        <node op="Mul" title="Apply Betas">
            <params name="W" dim="[var(n)]" />
            <input src="x" />
            <output name="wx" />
        </node>
        <node op="Add" title="Apply Biases">
            <params name="b" dim="[var(n)]" />
            <input src="wx" />
            <output name="y" />
        </node>
    </block>
    <export from="y" dim="[var(n)]" />
</model>
```

Note that we called the intermediate output `wx`, which we were then able to use in the next node. Also, note that nodes must appear in a topologically sorted order.

Now that we've specified our model, we can try importing it into PyTorch for training.
