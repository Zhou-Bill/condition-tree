import { ConditionType, Options } from './data'
import './index.less'
import { Node } from './tree'
import classNames from 'classnames'

export type ConditionsType = {
  val: Options | ConditionType
  child: Node<(Options | ConditionType), (Options | ConditionType)>[]
  parent: Node<Options | ConditionType, (Options | ConditionType)> | null
}

interface ConditionProps {
  conditions: ConditionsType
  path?: string
  onRemove?: (node: Node<Options | ConditionType, Options | ConditionType>) => void
  onAddNext?: (node: Node<Options | ConditionType, Options | ConditionType>) => void
  onAddGroup?: (node: Node<Options | ConditionType, Options | ConditionType>) => void
}
const Conditions = (props: ConditionProps) => {
  const { conditions, path = '', onAddNext, onRemove, onAddGroup } = props

  const handleAppend = (node: Node<Options | ConditionType, Options | ConditionType>) => {
    onAddGroup?.(node)
  }

  /**
   * path 已 . 分割的路径
   * @param path 1.1  // 1.1.1
   */
  const handleAddOption = (node: Node<Options | ConditionType, Options | ConditionType>) => {
    onAddNext?.(node)
  }

  const handleRemove = (node: Node<Options | ConditionType, Options | ConditionType>) => {
    onRemove?.(node)
  }

  const renderConditionNode = (record: Node<Options, Options>, path: string) => {
    return (
      <div className='condition-list-item-content'>
        <div>{path}. </div>
        <div className='condition-list-item-content-value'>
          <div>{record.val.key}</div>
          {/* <div>{record.action}</div>
          <div>{record.value as string}</div> */}
        </div>
        <div className='condition-list-item-content-action'>
          <div onClick={() => handleAddOption(record)}>+</div>
          <div onClick={() => handleRemove(record)}>-</div>
        </div>
      </div>
    )
  }

  const renderNode = (_item: Node<Options | ConditionType, Options | ConditionType>, path: string) => {
    if (_item.val.type === 'group') {
      return (
        <Conditions 
          key={path}
          conditions={_item} 
          path={path} 
          onAddNext={handleAddOption}
          onRemove={handleRemove}
          onAddGroup={handleAppend}
        />
      )
    }

    return renderConditionNode(_item as Node<Options, Options>, path) 
  }

  if (conditions?.child?.length === 0) {
    console.log(conditions)
    return null

  }

  return (
    <div style={{border: '1px solid #ccc', padding: '12px'}}>
      <div>{conditions.val.key}</div>
      <div className='condition-container'>
        <div className='condition-list'>
          {
            conditions?.child?.map((_item, _index) => {
              return (
                <div className={classNames('condition-list-item', {
                  'condition-list-item-only': conditions.child.length === 1
                })} key={_item.val.key || _index}>
                  {renderNode(_item, `${path ? `${path}.` : ''}${_index}`)}
                </div>
              )
            })
          }
        </div>
        {
          conditions?.child.length > 0 && (
            <div className='condition-action'>
              <div>{conditions?.val?.value}</div>
            </div>
          )
        }
      </div>
      {
        conditions?.child.length > 0 && (
          <div className='condition-operation'>
            <div onClick={() => handleAppend(conditions)}>+</div>
            <div onClick={() => handleRemove(conditions)}>-</div>
          </div>
        )
      }
    </div>
  )
}

export default Conditions