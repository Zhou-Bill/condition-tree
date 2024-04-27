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
export default treeToAst