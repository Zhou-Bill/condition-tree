import './index.less'

export type Options = {
  /**  */
  key: string,
  type: 'node' & string
  action?: ('===' | 'like' | 'in' | '<=' | '>=' | '<' | '>' | '!=' | 'between'),
  value: string,
}

type ConditionType = {
  /** node => 节点 group => 节点组 */
  type: ('group') & string
  value: ('AND' | 'OR') & string,
  key: string,
  nodes: (Options | ConditionType)[]
}

interface ConditionProps {
  conditions: ConditionType
  path?: string
  onAdd?: (path: string) => void
  onRemove?: (path: string) => void
}
const Conditions = (props: ConditionProps) => {
  const { conditions, path = '', onAdd } = props

  const handleAppend = (path: string) => {
    onAdd?.(path)
  }

  /**
   * path 已 . 分割的路径
   * @param path 1.1  // 1.1.1
   */
  const handleAddOption = (path: string) => {
    console.log(123123, path)
    onAdd?.(path)
  }

  const renderConditionNode = (record: Options, path: string) => {
    return (
      <div className='condition-list-item-content'>
        <div>{path}. </div>
        <div className='condition-list-item-content-value'>
          <div>{record.key}</div>
          <div>{record.action}</div>
          <div>{record.value as string}</div>
        </div>
        <div className='condition-list-item-content-action'>
          <div onClick={() => handleAddOption(path)}>+</div>
          <div>-</div>
        </div>
      </div>
    )
  }

  const renderNode = (_item: Options | ConditionType, path: string) => {
    if (_item.type === 'group') {
      return (
        <Conditions 
          key={path}
          conditions={_item} 
          path={path} 
          onAdd={handleAddOption}
        />
      )
    }

    return renderConditionNode(_item as Options, path) 
  }

  return (
    <div style={{border: '1px solid #ccc', padding: '12px'}}>
      <div className='condition-container'>
        <div className='condition-list'>
          {
            conditions.nodes.map((_item, _index) => {
              return (
                <div className='condition-list-item' key={_item.key || _index}>
                  {renderNode(_item, `${path ? `${path}.` : ''}${_index}`)}
                </div>
              )
            })
          }
        </div>
        <div className='condition-action'>
          <div>{conditions.value}</div>
        </div>
      </div>
      <div className='condition-operation'>
        <div onClick={() => handleAppend(path)}>+</div>
        <div>-</div>
      </div>
    </div>
  )
}

export default Conditions