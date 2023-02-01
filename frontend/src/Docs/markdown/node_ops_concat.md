# Concat

`op="Concat"`

The concat operator takes once required attribute, "axis", which determines which axis along which to concatenate. The accepted range in $[-r, r-1]$ where $r=rank(inputs)$.

Example:

```
<!-- ... some output with name="x" -->
<node op="Concat" axis="0">
    <input src="x" dims="[3, 5]" />
    <input src="y" dims="[7, 5]" />
    <output name="z" dims="[10, 5]" />
</node>
```
