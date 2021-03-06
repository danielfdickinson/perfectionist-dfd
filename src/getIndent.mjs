import space from './space.mjs';

export default function getIndent (node, indent = ' ', base = 4) {
    let level = 0;
    let {parent} = node;
    while (parent && parent.type !== 'root') {
        level++;
        parent = parent.parent;
    }
    return space(level * base, indent);
}
