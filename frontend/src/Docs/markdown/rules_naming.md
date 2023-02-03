# Naming Rules

(1) **You may not use the `$` character** in any names in an Agrippa project. When names are mangled, sometimes the `$` is used to divide the name into different bits. For example, in a repeated block, node outputs in a third intermediate layer will output with name `node_output$3`.

(2) **Names for independent inputs and outputs must be unique across a single file.**. For example, if you use the name `add_out` in one block somewhere in your model, no other node, even in a different block, may use the output or input name `add_out`. The only exception to this rule is when a block is sourced from a different file. In that case, the name is mangled to include the `name` attribute of the sourced block, which, along with rule 1, guarantees that the names are unique.

