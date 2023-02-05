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