# Reduce Sum

`op="ReduceSum"`

Reduce Sum can be used to find the sum of a tensor along specified axes. The `axes` attribute is required and defines a list of integers with accepted range $[-r, r-1]$ where $r$ is the rank of the input tensor. The `keepdims` attribute is an optional integer attribute: by default it is set to $1$, which means that the reduced dimension is kept in the output. Otherwise the dimension is removed.
