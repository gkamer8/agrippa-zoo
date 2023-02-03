# Sourced Blocks

You can split your model into separate files using sourced blocks.

A sourced block contains the attributes `src` and `name`. The `src` should be a relative path to the sourced file from the file that the block appears in. The `name` attribute determines how you may pass inputs to that sourced block and receive outputs from it. **A sourced block should contain no children.**

The sourced file may have a `model` or `block` tag as its root. The result will be the same in either case.

In order to pass inputs to a sourced block, the relevant node output should have name `sourced_block_name$relevant_name_in_other_block`. The text before the `$` should be whatever you assigned the `name` attribute in the sourced block. The text afterward should be the name you want that output to become inside the other block. You can refer to the outputs of the other block in the original file using the same notation.