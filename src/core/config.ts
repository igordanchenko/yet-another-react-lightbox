import { Augmentation, Component, Module, Node, Plugin } from "../types.js";

export const createModule = (name: string, component: Component): Module => ({
    name,
    component,
});

export const createNode = (module: Module, children?: Node[]): Node => ({
    module,
    children,
});

const traverseNode = (node: Node, target: string, apply: (node: Node) => Node[] | undefined): Node[] | undefined => {
    if (node.module.name === target) {
        return apply(node);
    }
    if (node.children) {
        return [
            createNode(
                node.module,
                node.children.flatMap((n) => traverseNode(n, target, apply) ?? [])
            ),
        ];
    }
    return [node];
};

const traverse = (nodes: Node[], target: string, apply: (node: Node) => Node[] | undefined): Node[] =>
    nodes.flatMap((node) => traverseNode(node, target, apply) ?? []);

export const withPlugins = (root: Node[], plugins?: Plugin[]): { config: Node[]; augmentation: Augmentation } => {
    let config = root;
    const augmentations: Augmentation[] = [];

    const addParent = (target: string, module: Module) => {
        if (target === "") {
            config = [createNode(module, config)];
            return;
        }
        config = traverse(config, target, (node) => [createNode(module, [node])]);
    };

    const addChild = (target: string, module: Module, precede?: boolean) => {
        config = traverse(config, target, (node) => [
            createNode(node.module, [
                ...(precede ? [createNode(module)] : []),
                ...(node.children ?? []),
                ...(!precede ? [createNode(module)] : []),
            ]),
        ]);
    };

    const addSibling = (target: string, module: Module, precede?: boolean) => {
        config = traverse(config, target, (node) => [
            ...(precede ? [createNode(module)] : []),
            node,
            ...(!precede ? [createNode(module)] : []),
        ]);
    };

    const replace = (target: string, module: Module) => {
        config = traverse(config, target, (node) => [createNode(module, node.children)]);
    };

    const remove = (target: string) => {
        config = traverse(config, target, (node) => node.children);
    };

    const augment = (augmentation: Augmentation) => {
        augmentations.push(augmentation);
    };

    plugins?.forEach((plugin) => {
        plugin({
            addParent,
            addChild,
            addSibling,
            replace,
            remove,
            augment,
        });
    });

    return {
        config,
        augmentation: (props) => augmentations.reduce((acc, augmentation) => augmentation(acc), props),
    };
};
