# Transpose

`op="Transpose"`

The transpose operation. By default, the dimensions are reversed. This operation takes an optional attribute `perm`, a list of ints specifying how the dimensions should be rearranged.

According to the ONNX docs:

>Transpose the input tensor similar to numpy.transpose. For example, when perm=(1, 0, 2), given an input tensor of shape (1, 2, 3), the output shape will be (2, 1, 3).

**NOTE:** when a transpose operation is imported into PyTorch using the agrippa package, if the rank of the tensor is greater than 2 (and no perm attribute is set), dimension 0 always remains in place. This behavior is designed to permit seamless batch support in PyTorch on models that do not explicitly give batch dimensions.
