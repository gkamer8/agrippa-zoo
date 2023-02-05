# Agrippa Python Package

In order to compile your projects, you should use the Agrippa Python Package. You can install the package using:

```
pip install agrippa
```

After building you project in some directory, you can export the project into the .ONNX format, a general format for neural networks:

```
import agrippa

model_dir = '../path/to/dir'
agrippa.export(model_dir, 'outfile_name.onnx')
```