import { useState } from "react";
import Conditions from "./condition";
import { data } from "./data";
import { dataTraverseToTree, Node } from './tree'

const WrapComponent = () => {
  const [conditionData] = useState(() => dataTraverseToTree(data))
  console.log(conditionData.root.child[0])

  const handleAddOption = (path: string) => {
    const temp = {
      key: 'A' + Math.random().toString(36).substring(7),
      action: '===' as const,
      value: '1',
      type: 'node' as const,
    }
    console.log(path)
    // const newConditionOptions = { ...conditionOptions }
    // if (path === '') {
    //   newConditionOptions.options.push(temp)
  
    //   setConditionOptions(newConditionOptions)
    //   return
    // }
    // const pathArr = path.split('.')
    // console.log(pathArr)
    // const lastPath = pathArr[pathArr.length - 1] + 1
    // console.log(pathArr.slice(0, -1))
    // const target = get(newConditionOptions.options, pathArr.slice(0, -1))
    // console.log(target)
    // newConditionOptions.options.splice(lastPath, 0, temp)
   
  }

  return (
    <div>
      {/* <Conditions conditions={data} onAdd={handleAddOption} /> */}
    </div>
  )
}

export default WrapComponent