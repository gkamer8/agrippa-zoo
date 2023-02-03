# Sharing Parameters

In order to set a parameter as shared, set the `shared` attribute of a `params` tag to `"yes"`. Under the hood, this means that only one ONNX initializer will be created for that parameter, and any `params` tag with the same `name` attribute will map to that ONNX initializer.

In some schemes, parameters are "shared" but they are not exactly the same: for example, one instance might use a transposed version of parameters meant to be used somewhere else in the model. In this case, we would recommend using an Identity node that has a `params` tag as its only child. Other nodes can use the output of that node as an input, and the gradients will be properly back-propagated.

Inside repeated blocks, a parameter with the `shared` attribute set to `"yes"` will cause the parameter's weights to be shared in every layer. The same goes for blocks using the `stretch` attribute.
