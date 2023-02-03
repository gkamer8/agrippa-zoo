# Model Inputs and Outputs

The root inputs and outputs are special. They denote the tensors your model takes in from a user and then outputs to the user. They are defined by `import` and `export` tags that appear as direct children to the `model` tag. The `dim` attribute for those `import` and `export` tags is required. The `from` attribute is also required for `import` and `export` tags. The `import` and `export` tags take no children.

Example:

```
<model>
    <import from="input1" dim="[1, 2, 3]" />
    <!-- Rest of model -->
    <export from="node_output1" dim="[4, 5, 6]" />
</model>
```
