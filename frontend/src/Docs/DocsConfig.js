
// List of triples, defined recursively - ['title', markdownfile.md, {'section_name': ['Title, 'markdownfile.md', {}]}] etc
export const SECTION_MAP = [
    null, 'main.md', {
        'getting-started': ['Getting Started', 'getting_started.md', {
            'getting-started-1': ['Creating the Model', 'getting_started_1.md', {}],
            'getting-started-2': ['Training the Model', 'getting_started_2.md', {}],
            'getting-started-3': ['Inference', 'getting_started_3.md', {}],
            'getting-started-4': ['Upload and Visualize', 'getting_started_4.md', {}]
        }],
        'basics': ['Markup Basics', 'basics.md', {
            'basics-model': ['Model Tag', 'basics_model_tag.md', {}],
            'basics-root-io': ['Model Inputs & Outputs', 'basics_root_io.md', {}],
            'basics-blocks': ['Blocks', 'basics_blocks.md', {}],
            'basics-nodes': ['Nodes', 'basics_nodes.md', {}],
            'basics-params': ['Parameters', 'basics_params.md', {}],
            'basics-exprs': ['Variables and Expressions', 'basics_exprs.md', {}]
        }],
        'package': ['Python Package', 'package.md', {
            'package-export': ['Export', 'package_export.md', {}],
            'package-pytorch': ['PyTorch', 'package_pytorch.md', {}],
            'package-utils': ['Utilities', 'package_utils.md', {}]
        }],
        'rules': ['Rules', 'rules.md', {
            'no-stretch-and-rep': ['No Stretch and Rep', 'rules_no_stretch_and_rep.md', {}],
            'naming': ['Naming Rules', 'rules_naming.md', {}]
        }],
        'types': ['Types', 'types.md', {}],
        'node-ops': ['Node Ops', 'node_ops.md', {
            'add': ['Add', 'node_ops_add.md', {}],
            'concat': ['Concat', 'node_ops_concat.md', {}],
            'conv': ['Conv', 'node_ops_conv.md', {}],
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
        }],
        'features': ['Advanced Features', 'features.md', {
            'reps': ['Repeated Blocks', 'features_reps.md', {}],
            'stretch': ['Stretched Blocks', 'features_stretch.md', {}],
            'shared-parameters': ['Shared Parameters', 'features_shared_parameters.md', {}],
            'frozen-parameters': ['Frozen Parameters', 'features_frozen_parameters.md', {}],
            'sourced-blocks': ['Sourced Blocks', 'features_sourced_blocks.md', {}]
        }],
    }
]
