import { tokenized, parser, transformer, codeGenerator } from './utils'
import { ConditionsContainer } from './components/condition'
import { dataTraverseToTree, Node } from './components/condition/tree'
import { data } from './components/condition/data'

console.log(codeGenerator(transformer(parser(tokenized("AND(A,B,OR(C,D,E))")))))
console.log(codeGenerator(transformer(parser(tokenized("OR(AND(A,B,OR(C,D,E,AND(F,G))),I,OR(AND(A,B,C),D,E))")))))

console.log(dataTraverseToTree(data))
const { treeNodeMap, root } = dataTraverseToTree(data)

const res = treeNodeMap.get('root')
res.child.push(new Node({
  key: 'A' + Math.random().toString(36).substring(7),
  action: '===' as const,
  value: '1',
  type: 'node' as const,
}, undefined, res))
console.log(root.child[0])
console.log(res)

function App() {

  return (
    <>
      <div>
        <ConditionsContainer />
      </div>
    </>
  )
}

export default App
