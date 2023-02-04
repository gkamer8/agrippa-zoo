# Parameters

Parameters are auxiliary tensors used in your model. By default, when imported into PyTorch, they can be trained. Under the hood, they are stored in the `weights.pkl` file by default as numpy arrays and stored in the compiled ONNX file. If the model is saved from PyTorch, they will be stored as PyTorch tensors.

They take required `name` and `dim` attributes. The `name` specifies a substring that is guaranteed to appear in the PyTorch model's state dict as well as the exported ONNX file's initializers. The `dim` attribute gives the dimensions of the parameter, which is a list of dimensions like `"[var(dkeys), var(dmodel)]"`.

Some other optional attributes:

`init` and `init_args`: the `init` attribute determines the type of initialization, which can be one of: "xavier", "normal", "uni_random", "ones", "zeros", or "constant". The "xavier" initialization means normal with mu=0 and standard deviation = $\sqrt{2/(D_{-1}+D_{-2})}$ where $D_i$ is dimension $i$. The `init_args` attribute is a list determining the arguments for the initialization.

For "normal", `init_args` is a list of length two with the first value being the mean and second being the standard deviation. For "uni_random", `init_args` is similarly a list of length determining the bounds of the distribution, like "[-1, 1]". For "constant", `init_args` is a list of length one determining the value the parameter should be initialized to.

The default initialization is "xavier".
