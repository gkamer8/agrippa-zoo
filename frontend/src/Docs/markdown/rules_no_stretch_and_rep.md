# No Stretch and Rep

You may not use the "stretch" and "rep" attributes in the same block. This rule exists because the result is ambiguous and difficult to compile. You may, however, use `rep` and `stretch` in different blocks in which one is a child of the other. For example, **the following code is absolutely fine**:

```
<model script-version="0.0.1">

    <import dim="[3, 2]" from="input" type="float32" />

    <!-- The outer block is repped, and the inner is stretched -->
    <block title="Repped" rep="3">
        <import from="input" />
        <block title="Stretched" stretch="3">
            <import from="input" />
            <block title="ChildStretch">
                <import from="input" />
                <node op="Identity" title="IdenOp">
                    <input src="input" />
                    <output name="inter_iden1" />
                </node>
                <node op="Identity" title="IdenOp2">
                    <input src="inter_iden1" />
                    <output name="inter_iden2" />
                </node>
                <export from="inter_iden2" />
            </block>
            <node op="Identity" title="IdenOp3">
                <input src="inter_iden2" />
                <output name="iden" />
            </node>
            <export from="iden" />
        </block>
        <export from="inter_iden1" />
    </block>

    <export dim="[3, 6]" from="iden" type="float32" />

</model>
```