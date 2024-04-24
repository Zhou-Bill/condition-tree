
class Node<T> {
    val: T
    child: Node<T>[]
    parent: Node<T> | null
    constructor(val?: T, child? : Node<T>, parent? : Node<T>) {
      this.val = val as T;
      this.child = [];
      this.parent = (parent === undefined ? null : parent);
    }
}

const dataTraverseToTree = (data: any) => {
  const root = new Node<string>("root")
  const treeNodeMap = new Map()

  const traverse = (node: any, parent: any) => {
    const { nodes, ...rest } = node
    const treeNode = new Node(rest, undefined, parent)
    treeNodeMap.set(rest.key, treeNode)

    parent.child.push(treeNode)
    
    if (typeof nodes === 'undefined') {
      return 
    }

    for (let i = 0; i < nodes.length; i++) {
      traverse(nodes[i], treeNode, )
    }
  }
  traverse(data, root)
  return {
    root,
    treeNodeMap
  }
}


export {
  dataTraverseToTree,
  Node,
}