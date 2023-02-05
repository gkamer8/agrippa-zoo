# Importing to PyTorch

In order to take an ONNX file created using the Agrippa python package and import it into PyTorch, you can use the `agrippa.onnx_to_torch` function. It can be used like so:

```
import agrippa

proj_name = 'simple-project'
onnx_out = 'simple_testing.onnx'

agrippa.export(proj_name, onnx_out)

torch_model = agrippa.onnx_to_torch(onnx_out)
```

If you use the `agrippa.onnx_to_torch` function on an ONNX file not created by the Agrippa package, it is possible that the file will use operations not currently supported by the `onnx_to_torch` function. Certain other features, like frozen parameters, are practically guaranteed not to work. For inference, it is usually best simply to run the ONNX file using the `onnxruntime` environment.
