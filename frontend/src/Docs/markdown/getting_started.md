# Getting Started

First, you can install the agrippa Python package using pip:

```
pip install agrippa
```

Next, you can begin building your project. Every model is contained within a project directory.

The project directory may contain:

1. One or more files with the extension .agr or .xml specifying the model architecture
2. A weights.pkl file to specify the parameter values in the model (optional)
3. A meta.json file to define certain metadata, like the producer name in the ONNX file (very optional)

The architecture file is parsed like XML, so it should be well-formed XML. Recall that tags with no respective end-tag should end with  `\>`, and all attributes should be formatted like strings with quotes around them.

Once you have created your project directory with the associated files, you can compile the model using the following code. You can also try downloading an example from the Model Zoo and compiling a project from there.

```
import agrippa

proj_name = '../path/to/dir'

bindings = {
    # ... Remember to assign variable bindings if the model requires them!
}

# Convert xml to onnx
agrippa.export(proj_name, 'testing.onnx', bindings=bindings)
```

To run the model — for example, by using ONNX runtime — you might write:

```
# Remember to pip install onnxruntime if you have not already!
import onnxruntime as ort
import numpy as np

dims = (3, 5)  # or your input dimensions
x = np.ones(dims).astype("float32")

ort_sess = ort.InferenceSession('testing.onnx', providers=['CPUExecutionProvider'])

# Our root model import is called "input"
outputs = ort_sess.run(None, {'input': x})
```
