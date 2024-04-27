import { omit } from "lodash-es";
import { ConditionType, Options } from "./data";

class Node<T, P> {
    val: T
    child: Node<T, P>[]
    parent: Node<T, P> | null
    constructor(val?: T, parent? : Node<T, P>) {
      this.val = val as T;
      this.child = [];
      this.parent = (parent === undefined ? null : parent);
    }
}

const dataTraverseToTree = (data: ConditionType) => {
  const root = new Node<string, string>("root")
  const treeNodeMap = new Map()

  const traverse = (node: ConditionType | Options, parent: any) => {
    const nodes = (node as ConditionType).nodes || []
    const rest = omit(node, ['nodes'])
    const treeNode = new Node<ConditionType | Options, ConditionType | Options>(rest as ConditionType | Options, parent)
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