# Reps

Blocks may take an attribute named `rep` as in `rep="var(nlayers)"`. By specifying `rep`, you essentially ask the compiler to repeat the block some number of times. The exports of the block are fed into the next input, and so on in a stacked fashion.

A repeated block **must include import and export tags**. They specify how the block should reuse its outputs. The imports and exports need not be equal in number; they are matched sequentially.

When referring to the exports of the block elsewhere in the model, you can use the original name you gave to those exports. The exports of the final block are the ones matched to the original name. If you wish to use intermediate steps, you must account for name mangling; this feature is not currently supported, but it is possible with some effort.

**It is illegal to use the stretch and rep attributes together.**

Here is an example of how a FFN might use a repeated block:

```
<model script-version="0.0.1">

    <import dim="[3, 1]" from="input" type="float32" />

    <block title="FFN" x="100" y="250" width="200" height="100">
        <import from="input" />
        <block title="FFN Layer" rep="5">
            <import from="input" />
            <node title="Linear" op="MatMul">
                <params dim="[3, 3]" name="W" type="float32" shared="no" />
                <input dim="[3, 1]" src="input" />
                <output dim="[3, 1]" name="linear" />
            </node>
            <node title="Bias" op="Add">
                <params dim="[3, 1]" name="B" type="float32" shared="no" />
                <input dim="[3, 1]" src="linear" />
                <output dim="[3, 1]" name="biased" />
            </node>
            <node title="ReLu" op="Relu">
                <input dim="[3, 1]" src="biased" />
                <output dim="[3, 1]" name="relu" />
            </node>
            <export from="relu" />
        </block>
        <export from="relu" />
    </block>

    <export dim="[3, 1]" from="relu" type="float32" />

</model>
```
