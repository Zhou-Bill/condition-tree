import { useState } from "react";
import Conditions, { ConditionsType } from "./condition";
import { ConditionType, data, Options } from "./data";
import { dataTraverseToTree, Node } from './tree'
import treeToAst from "../../utils/treeToAst";
import { codeGenerator, transformer } from "../../utils";

const WrapComponent = () => {
  const [conditionData, setConditionOptions] = useState(() => dataTraverseToTree(data))
  const handleAppend = (node: Node<Options | ConditionType, Options | ConditionType>) => {
    const temp = {
      key: 'APPEND' + Math.random().toString(36).substring(7),
      action: '===' as const,
      value: '1',
      type: 'node' as const,
    }
    const parent = node.parent
    const newNode = new Node(temp, parent || undefined)
    if (!parent?.child) {
      return 
    }
    const index = parent.child.findIndex(item => item.val.key === node.val.key)

    if (index === -1) {
      return
    }
    conditionData.treeNodeMap.set(temp.key, newNode)
    parent?.child.splice(index + 1, 0, newNode)
    setConditionOptions({...conditionData})
  }

  const handleAddGroup = (node: Node<Options | ConditionType, Options | ConditionType>) => {

    const groupNodes = [
      {
        type: 'node' as const,
        key: 'Axxxx',
        action: '===' as const,
        value: '1',
      }, 
      {
        type: 'node' as const,
        key: 'Bxxx',
        action: 'like' as const,
        value: '2',
      },
    ]

    const temp = {
      key: 'A' + Math.random().toString(36).substring(7),
      value: 'OR',
      type: 'group' as const,
    }
    const newNode = new Node<Options | ConditionType, Options | ConditionType>(temp as ConditionType, node)
    const childNode1 = new Node(groupNodes[0], newNode)
    const childNode2 = new Node(groupNodes[1], newNode)
    newNode.child.push(childNode1)
    newNode.child.push(childNode2)

    conditionData.treeNodeMap.set(temp.key, newNode)
    node?.child.push(newNode)
    setConditionOptions({...conditionData})

  }

  const handleRemove = (node: Node<Options | ConditionType, Options | ConditionType>) => {
    if (!node.parent) {
      return 
    }
    const index = node.parent.child?.findIndex(item => item.val.key === node.val.key)
    if (index > -1) {
      node.parent?.child.splice(index, 1)
      conditionData.treeNodeMap.delete(node.val.key)
      let parent = node.parent

      while (parent) {
        if (parent.child.length === 0) {
          if (parent.parent?.child) {
            
            const newChildren = parent.parent?.child.filter(item => item.val.type === 'node' || (item.child.length !== 0 && item.val.type === 'group'))
            parent.parent.child = newChildren
            conditionData.treeNodeMap.delete(parent.parent.val.key)
          }
        } 
        parent = parent.parent!
      }
    }
    console.log(conditionData.treeNodeMap)
    setConditionOptions({...conditionData})
  }

  const onExport = () => {
    const result = treeToAst(conditionData.root as unknown as Node<Options | ConditionType, Options | ConditionType>)
    console.log(result)
    console.log(codeGenerator(transformer(result)))

  }

  console.log(conditionData)

  return (
    <div>
      {/* <Conditions conditions={data} onAdd={handleAddOption} /> */}
      <Conditions 
        conditions={conditionData.root.child[0] as unknown as ConditionsType} 
        onAddNext={handleAppend}
        onRemove={handleRemove}
        onAddGroup={handleAddGroup}
      /> 
      <div onClick={onExport}>导出</div>
    </div>
  )
}

export default WrapComponent