# Export

The `agrippa.export` function is the primary function you use to compile projects.

Its usage is as follows:

```
import agrippa

model_dir = '../path/to/dir'
agrippa.export(model_dir, 'outfile_name.onnx')
```

The export has function header:

```
def export(
        infile,  # the markup file
        outfile=None,  # the .onnx file name
        producer="Unknown",  # ONNX file metadata
        graph_name="Unknown",  # ONNX file metadata
        write_weights=True,  # should this create a weights file, if none exists
        suppress=False,  # suppresses certain print statements
        reinit=False,  # reinitializes all weights from the weights file
        bindings=None  # a dictionary to bind variables present in the markup
    ):
```