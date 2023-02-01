# Node Ops

The "op" attribute in a node specifies the operation that the node carries out. For example, the following node multiplies an input by a learned scalar value:

```
<!-- ... some output with name="x" -->
<node op="Mul">
    <input src-"x" />
    <params name="g" dims="[1]" />
    <output name="y" />
</node>
```

## Supported ONNX OpTypes

The currently supported op types are are listed below. Select an op from the menu to check out its specification.

- Add
- Concat
- Identity
- LeakyRelu
- LpNormalization
- MatMul
- Mul
- Relu
- ReduceMean
- Softmax
- Sqrt
- Sub
- Tranpose
