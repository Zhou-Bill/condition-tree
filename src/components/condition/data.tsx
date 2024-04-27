export type Options = {
  /**  */
  key: string,
  type: 'node' & string
  action?: ('===' | 'like' | 'in' | '<=' | '>=' | '<' | '>' | '!=' | 'between'),
  value: string,
}

export type ConditionType = {
  /** node => 节点 group => 节点组 */
  type: ('group') & string
  value: ('AND' | 'OR') & string,
  key: string,
  nodes: (Options | ConditionType)[]
}

export const data: ConditionType = {
  key: 'root',
  type: 'group' as const,
  value: 'OR' as const,
  nodes: [
    {
      type: 'node' as const,
      key: 'A',
      action: '===' as const,
      value: '1',
    }, 
    {
      type: 'node' as const,
      key: 'B',
      action: 'like' as const,
      value: '2',
    },
    {
      key: 'C',
      value: 'AND' as const,
      type: 'group' as const,
      nodes: [
        {
          type: 'node' as const,
          key: 'D',
          action: '===' as const,
          value: '2'
        },
        {
          type: 'node' as const,
          key: 'E',
          action: '===' as const,
          value: '2'
        },
        {
          type: 'node' as const,
          key: 'F',
          action: '===' as const,
          value: '2'
        },
        {
          type: 'node' as const,
          key: 'h',
          action: '===' as const,
          value: '2' 
        },
        {
          key: 'G',
          value: 'AND' as const,
          type: 'group' as const,
          nodes: [
            {
              type: 'node' as const,
              key: 'j',
              action: '===' as const,
              value: '2'
            },
            {
              type: 'node' as const,
              key: 'k',
              action: '===' as const,
              value: '2'
            }
          ]
        }
      ]
    },
    {
      key: 'I',
      action: 'like' as const,
      value: '2',
      type: 'node' as const
    },
  ],
}