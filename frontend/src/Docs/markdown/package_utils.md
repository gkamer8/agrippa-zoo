# Utilities

The `agrippa.utils` namespace contains a variety of useful utilities when working with Agrippa projects. 

## Find Parameters

First, `agrippa.utils.find_params` searches a weights file for a weight matching a particular name. For example:

```
matches = agrippa.utils.find_params('bias', 'FNN')
print(matches)
```

...might print:

```
{'biases$1': array([[-0.77192398],
       [-0.02351803],
       [-0.00533084],
       [ 0.13640493],
       [-0.12087004]]), 'biases$2': array([[-0.18979854],
       [-0.15769928],
       [ 0.46656397],
       [-0.10602235]])}
```

## Save Torch Model

Second, the `agrippa.utils.save_torch_model` saves the weights of a model trained using PyTorch into a `weights.pkl` file. For example:

```
# ... training loop
agrippa.utils.save_torch_model(torch_model, "my-project", "weights.pkl")
```
Saves a new version of `weights.pkl` into the `my-project` directory.

## Find Internal Names

The Agrippa project compiles to ONNX, which requires changing some names around, especially for repeated blocks and stretch directives. You can see how those names are mangled (or just viewing compilation internals for debugging) by setting `log=True` in `agrippa.export`. A `log.json` file will be produced. The `log.json` file can be searched using `agrippa.utils.search_log` and setting the `name` parameter to the title of what you're searching for. The result will be a dictionary with various information. The returned objects are those with titles (ONNX names) that contain the `name` as a substring. For example, a search for `Embed` would return information about a node with `title="MyEmbedNode"` as an attribute.