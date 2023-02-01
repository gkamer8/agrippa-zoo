
// List of triples, defined recursively - ['title', markdownfile.md, {'section_name': ['Title, 'markdownfile.md', {}]}] etc
export const SECTION_MAP = [
    null, 'main.md', {
        'getting-started': ['Getting Started', 'getting_started.md', {}],
        'nodes':           ['Nodes', 'nodes.md', {
            'node-ops': ['Node Ops', 'node_ops.md', {
                'add': ['Add', 'node_ops_add.md', {}],
                'concat': ['Concat', 'node_ops_concat.md', {}],
                'identity': ['Identity', 'node_ops_identity.md', {}],
                'leaky-relu': ['Leaky Relu', 'node_ops_leaky_relu.md', {}]
            }]
        }],
    }
]
