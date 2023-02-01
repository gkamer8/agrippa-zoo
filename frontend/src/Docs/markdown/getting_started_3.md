# Inference

Many frameworks and runtime environments permit the usage of ONNX files. Here, we will show how one runtime framework, onnxruntime, can be used to run a model created using Agrippa.

Recall that when we saved our model, we wrote a `weights.pkl` file into our project directory. In order to create an ONNX file with weights sourced from that file, we must again export our model with `reinit=False`

```
agrippa.export(proj_name, onnx_out, bindings=bindings, reinit=False)
```

Now we can start an onnxruntime inference session to run our model.

```
ort_sess = ort.InferenceSession(onnx_out, providers=['CPUExecutionProvider'])

x, y = get_pair()
x = x.detach().numpy()  # onnxruntime expects numpy data, not torch tensors
outputs = ort_sess.run(None, {'x': x})  # remember, we named our import 'x'

print(f"Label: {y}")
print(f"Output: {outputs}")
```

Now you should have the basic pipeline for creating, training, and running models in our system. For more details, such as data typing, initializations, frozen parameters, and more, see the rest of the documentation.
