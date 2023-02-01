# Training the Model

In the previous section, we specified our model, which looks like:

```
<model>
    <import from="x" dim="[var(n)]" />
    <block title="Linear">
        <node op="Mul" title="Apply Betas">
            <params name="W" dim="[var(n)]" />
            <input src="x" />
            <output name="wx" />
        </node>
        <node op="Add" title="Apply Biases">
            <params name="b" dim="[var(n)]" />
            <input src="wx" />
            <output name="y" />
        </node>
    </block>
    <export from="y" dim="[var(n)]" />
</model>
```

That text was placed inside a folder called `lin-reg`, containing one file `main.agr`.

Now, outside the folder, we can write Python to process this model. Opening a file called `main.py` outside `lin-reg`, we will export the model into the ONNX format. Be sure to have `agrippa`, `torch`, and `onnxruntime` installed (which you can do using pip).

```
import agrippa
import torch  # for later
import onnxruntime as ort  # for later

proj_name = "lin-reg"

onnx_out = 'testing.onnx'

bindings = {
    'n': 5
}

agrippa.export(proj_name, onnx_out, bindings=bindings)
```

Recall that we bound the variable `n` to be the width of our input vector. Using `agrippa.export`, we passed the `bindings` dictionary so the ONNX file has the intended dimensions.

The ONNX file format is especially good for inference, but it can be cumbersome to train a model using it. So we will transform our model into a PyTorch module:

```
torch_model = agrippa.onnx_to_torch(onnx_out)
```

Now we can train the model as we would in PyTorch. Here, we train the model to emulate a random linear transformation:

```
target_weights = torch.rand((bindings['n'],))
target_biases = torch.rand((bindings['n'],))

def get_pair():
    x = torch.rand((bindings['n'],))
    y = target_weights * x + target_biases
    return x, y

optimizer = torch.optim.SGD(torch_model.parameters(), lr=0.1)

loss_fn = torch.nn.MSELoss()

for _ in range(5000):
    x, y = get_pair()

    # Zero your gradients for every batch!
    optimizer.zero_grad()

    # Make predictions for this batch
    outputs = torch_model(x)

    # Compute the loss and its gradients
    loss = loss_fn(outputs, y)
    loss.backward()

    # Adjust learning weights
    optimizer.step()
```

Next, we want to save the weights back into our project folder. A Python pickle file called `weights.pkl` will be created inside our project directory. Afterward, we can search the weights file to see what the model learned:

```
agrippa.utils.save_torch_model(torch_model, proj_name)

biases = agrippa.utils.find_params("b", proj_name)
weights = agrippa.utils.find_params("W", proj_name)

print(f"Target weights: {target_weights}")
print(f"Actual weights: {weights}")
print()
print(f"Target biases: {target_biases}")
print(f"Actual biases: {biases}")
```

When I ran the full program above, I got the following output:

```
Target weights: tensor([0.4677, 0.6371, 0.9488, 0.4824, 0.3376])
Actual weights: {'W$1': tensor([0.4919, 0.6406, 0.9244, 0.4775, 0.3975])}

Target biases: tensor([0.2762, 0.7549, 0.6595, 0.0879, 0.0644])
Actual biases: {'b$1': tensor([0.2632, 0.7532, 0.6725, 0.0905, 0.0322])}
```

Note that the names of the parameters were mangled slightly during compilation. For this reason, we use the `agrippa.utils.find_params` function, which searches the weights dictionary for matching substrings. The name you gave the parameter is guaranteed to be a matching substring of the resulting name.

In the next part, we will show how ONNX runtime can be used to perform efficient inference.
