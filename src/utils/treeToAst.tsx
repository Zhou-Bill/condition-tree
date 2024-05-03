// {
//   type: 'program',
//   body: [
//     {
//       type: 'CallExpression',
//       value: 'AND',
//       params: [
//         { type: 'StringLiteral', value: 'A' },
//         { type: 'StringLiteral', value: 'B' },
//         {
//           type: 'CallExpression',
//           value: 'OR',
//           params: [
//             { type: 'StringLiteral', value: 'C' },
//             { type: 'StringLiteral', value: 'D' },
//             { type: 'StringLiteral', value: 'E' }
//           ]
//         }
//       ]
//     }
//   ]
// }

import { ConditionType, Options } from "../components/condition/data";
import { Node } from "../components/condition/tree";

const treeToAst = (tree: Node<Options | ConditionType, Options | ConditionType>) => {
  const result: any = {
    type: 'Program',
    body: []
  }

  function walk(root: Node<Options | ConditionType, Options | ConditionType>) {
    if (root.val.type === 'group') {
      const node: {
        type: string,
        value: string
        params: {
          type: string,
          value: string
        }[]
      } = {
        type: 'CallExpression',
        value: root.val.value,
        params: []
      }

      root.child.forEach(child => {
        if (child.val.type === 'group') {
          node.params.push(walk(child))
        } else {
          node.params.push({
            type: 'StringLiteral',
            value: child.val.key
          })
        }
      })

      return node
    } else {
      return {
        type: 'StringLiteral',
        value: root.val.key
      }
    }

  }

  result.body.push(walk(tree.child[0]))

  return result
}

/**
 * AST to Tree
 */

export const astToTree = (ast) => {
  const result = new Node<string, null>('root')
  console.log(ast)
  const treeNodeMap = new Map()

  function walk (astTree: any, parent: Node<string, null> | null) {
    if (astTree.type === 'CallExpression') {
      const node = new Node<ConditionType | Options, ConditionType | Options>({
        key: astTree.key,
        value: astTree.value,
        type: 'group',
      } as ConditionType | Options, parent as any)
      // treeNodeMap.set(astTree.value, node)

      parent?.child.push(node)
      astTree.params.forEach((child: any) => {
        walk(child, node)
      })

    } else {
      const node = new Node({
        key: astTree.key,
        value: astTree.value,
        type: 'node',
      } as ConditionType | Options, parent as any)
      treeNodeMap.set(astTree.value, node)

      parent?.child.push(node)
    }
  }
  walk(ast.body[0], result)
  return {
    root: result,
    treeNodeMap
  }
}


export default treeToAst