# Advanced Features

Our markup language provides some shorthand for doing common things inside models. These features include:
- a `rep` attribute for blocks, which cause blocks to be stacked in a repeated fashion
- a `stretch` attribute for repeating a block many times horizontally and concatenating its outputs (as in an attention head)
- a `frozen` attribute for parameters to signal to the PyTorch conversion tool that the parameter should be treated as a constant
- a `shared` attribute for shared parameters

.. and more
