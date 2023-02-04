# Conv

"Conv" is the convolution operator. It based on the [ONNX spec here](https://github.com/onnx/onnx/blob/main/docs/Operators.md#Conv), but there are some differences.

It takes two children: the first is the `<input/>` data, and the second is the `<params/>` weights. The input data follow the following rules:

>Input data tensor from previous layer; has size (N x C x H x W), where N is the batch size, C is the number of channels, and H and W are the height and width. Note that this is for the 2D image. Otherwise the size is (N x C x D1 x D2 ... x Dn). Optionally, if dimension denotation is in effect, the operation expects input data tensor to arrive with the dimension denotation of [DATA_BATCH, DATA_CHANNEL, DATA_FEATURE, DATA_FEATURE ...].

And for the parameters:

>The weight tensor that will be used in the convolutions; has size (M x C/group x kH x kW), where C is the number of channels, and kH and kW are the height and width of the kernel, and M is the number of feature maps. For more than 2 dimensions, the kernel shape will be (M x C/group x k1 x k2 x ... x kn), where (k1 x k2 x ... kn) is the dimension of the kernel.

It also takes some optional attributes:

- `kernel_shape`: the dimensions of the kernel (i.e., "[3, 3]"). By default, this value is implied from the parameters.
- `pads`: list of ints, "Padding for the beginning and ending along each spatial axis, it can take any value greater than or equal to 0. The value represent the number of pixels added to the beginning and end part of the corresponding axis. `pads` format should be as follow [x1_begin, x2_begin...x1_end, x2_end,...], where xi_begin the number of pixels added at the beginning of axis `i` and xi_end, the number of pixels added at the end of axis `i`."
- `dilations`: list of ints, "dilation value along each spatial axis of the filter. If not present, the dilation defaults is 1 along each spatial axis."
- `strides`: list of ints, "Stride along each spatial axis. If not present, the stride defaults is 1 along each spatial axis."