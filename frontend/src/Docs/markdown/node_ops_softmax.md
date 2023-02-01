# Softmax

`op="Softmax"`

A Softmax layer, which takes a required attribute `axis`, specifying the axis along which the Softmax will be performed. The output tensor is of the same shape as the input tensor.

The Softmax is defined by: $\sigma(x)_i=\frac{e^{x_i}}{\sum_{i=1}^{K}e^{x_i}}$ for $x=(x_1,...,x_K) \in \mathbb{R}^K$