# Exposed Naming

In rare circumstances, you might like to quickly export (that is, make as an output of the entire model) some output of a node whose name gets replaced in the actual ONNX compilation. For example, the name of the export of the first output of a repeated block will get overridden by the name of the export that comes last (i.e., a reference to `MyOutput` would actual refer to `MyOutput$5`, the last output in a repeated block). If you would like to refer to the original `MyOutput`, you can set `exposed="yes"` as an attribute of the node. Inside that node, names of inputs (things specified with the input tag) won't get overridden.

Generally, it is recommended that instead you explicitly break up the repeated block which you would like to find intermediate activations from and export those intermediate activations with their precise names.

One way to accomplish this without worrying about finding unique names for various exports is to make the block its own file. Then that file can be imported as a block, and you can simply explicitly source each layer with a separate name.
