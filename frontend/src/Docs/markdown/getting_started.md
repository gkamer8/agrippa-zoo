# Getting Started

You can install the agrippa Python package using pip:

```
pip install agrippa
```

If you have conflicting dependencies, you may want to first start a virtual environment:

```
python3 -m venv venv
source venv/bin/activate
pip install agrippa
```

Next, you can begin building your project. Every model is contained within a project directory.

The project directory may contain:

1. One or more files with the extension .agr or .xml specifying the model architecture
2. A weights.pkl file to specify the parameter values in the model (optional)
3. A meta.json file to define certain metadata, like the producer name in the ONNX file (very optional)

The architecture file is parsed like XML, so it should be well-formed XML. Recall that tags with no respective end-tag should end with  `\>`, and all attributes should be formatted like strings with quotes around them.

In this tutorial we will perform a linear regression from scratch.
