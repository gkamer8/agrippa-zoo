# Frozen Parameters

When a `params` tag has the `frozen` attribute set to `yes`, the name will be mangled as to signal to the Agrippa PyTorch conversion that the parameter should be added as a buffer rather than a parameter, which ensures that it will be untouched by the training process. Under the hood, this is done by adding `$constant` to the parameter's name during compilation. If the parameter does not exist inside a weights file, it will be initialized normally.
