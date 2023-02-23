# Variables and Expressions

Any attribute in an architecture markup file can include an expression or a variable. An expression is given by `expr()`, and a variable is given by `var()`.

Currently, expressions can only process simple integers and floats. They do not support more complex datatypes.

Expressions support the following operations:
- `^` for powers
- `*` for multiplication
- `/` for regular division
- `%` for modulus
- `-` for subtraction
- `+` for addition
- `//` for integer division

Variables inside expressions (or var()'s) are bound to the model in Python. For example, when you export a model containing an expression with the variable `nlayers`, you can specify `nlayers` when you export the model like so:

```
bindings = {
    'nlayers': 5
}

agrippa.export('example-proj', 'out.onnx', bindings=bindings)
```

Please note that for now, variables are meant to stand for XML attribute values, which means that they are converted to strings during compilation. You should avoid using complex datatypes like tensors, though lists are allowed. If you are trying to use a large, complicated value in a variable, try making the value an input to the model instead so that it can be processed in the runtime environment.

The two lines `expr(my_var)` and `var(my_var)` are equivalent, though expr(my_var * 2) is allowed while var(my_var * 2) is not.

When specifying variable sized dimensions, it is recommended to use the following pattern:

```
<!-- An example parameter of dimensions [2n, n] -->
<params name="ExampleParam" dim="[expr(2 * n), var(n)]">
```