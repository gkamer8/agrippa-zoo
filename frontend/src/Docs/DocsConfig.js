
// List of triples, defined recursively - ['title', markdownfile.md, {'section_name': ['Title, 'markdownfile.md', {}]}] etc
export const SECTION_MAP = [
    null, 'main.md', {
        'getting-started': ['Getting Started', 'getting_started.md', {
                'getting-started-1': ['Creating the Model', 'getting_started_1.md', {}],
                'getting-started-2': ['Training the Model', 'getting_started_2.md', {}],
                'getting-started-3': ['Inference', 'getting_started_3.md', {}],
                'getting-started-4': ['Upload and Visualize', 'getting_started_4.md', {}]
            }],
        'nodes': ['Nodes', 'nodes.md', {
            'node-ops': ['Node Ops', 'node_ops.md', {
                'add': ['Add', 'node_ops_add.md', {}],
                'concat': ['Concat', 'node_ops_concat.md', {}],
                'identity': ['Identity', 'node_ops_identity.md', {}],
                'leaky-relu': ['Leaky Relu', 'node_ops_leaky_relu.md', {}],
                'lp-normalization': ['LP Norm', 'node_ops_lp_normalization.md', {}],
                'matmul': ['MatMul', 'node_ops_matmul.md', {}],
                'mul': ['Mul', 'node_ops_mul.md', {}],
                'relu': ['Relu', 'node_ops_relu.md', {}],
                'reduce-mean': ['Reduce Mean', 'node_ops_reduce_mean.md', {}],
                'softmax': ['Softmax', 'node_ops_softmax.md', {}],
                'sqrt': ['Sqrt', 'node_ops_sqrt.md', {}],
                'sub': ['Sub', 'node_ops_sub.md', {}],
                'transpose': ['Transpose', 'node_ops_transpose.md', {}]
            }]
        }],
    }
]
