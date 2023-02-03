# Parameters

Parameters are auxiliary tensors used in your model. By default, when imported into PyTorch, they can be trained. Under the hood, they are stored in the `weights.pkl` file by default as numpy arrays and stored in the compiled ONNX file. If the model is saved from PyTorch, they will be stored as PyTorch tensors.

They take required `name` and `dim` attributes. The `name` specifies a substring that is guaranteed to appear in the PyTorch model's state dict as well as the exported ONNX file's initializers. The `dim` attribute gives teh dimensions of the parameter, which is a list of dimensions like `"[var(dkeys), var(dmodel)]"`.
