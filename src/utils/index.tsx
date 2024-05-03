/**
 * AND(A,B,OR(C,D,E)) => 
 */

type TokenType = {
  type: 'name' | 'letter' | 'paren',
  value: string 
}

const CODE_MAP = {
  AND: "&&",
  OR: '||',
}

export const tokenized = (expression: string) => {
  let current = 0
  const tokens: TokenType[] = []

  while (current < expression.length) {
    let char = expression[current];

    const LETTER = /[A-Z]/
    if (LETTER.test(char)) {
      let value = ''

      while (LETTER.test(char)) {
        value += char
        char = expression[++current]
      }

      if (value === 'AND' || value === 'OR' || value === 'NOT') {
        tokens.push({ type: 'name', value })
      } else {
        tokens.push({ type: 'letter', value })
      }
      
    }

    if (char === '(') {
      tokens.push({ type: 'paren', value: '(' })
      current++
      continue
    }

    if (char === ')') {
      tokens.push({ type: 'paren', value: ')' })
      current++
      continue
    }


    current++
  }

  return tokens;
}

// [
//   { type: 'name', value: 'AND' },
//   { type: 'paren', value: '(' },
//   { type: 'letter', value: 'A' },
//   { type: 'letter', value: 'B' },
//   { type: 'name', value: 'OR' },
//   { type: 'paren', value: '(' },
//   { type: 'letter', value: 'C' },
//   { type: 'letter', value: 'D' },
//   { type: 'letter', value: 'E' },
//   { type: 'paren', value: ')' },
//   { type: 'paren', value: ')' }
// ]

// tokenized("AND(A,B,OR(C,D,E))")

/**
 * 将token 转成 类似于AST的结构
 */

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

type StringLiteralNode = {
  type: 'StringLiteral',
  value: string
}

type ProgramNode = {
  type: 'Program',
  body: (StringLiteralNode | CallExpressionNode)[]
  _context?: (StringLiteralNode | CallExpressionNode)[]
}

type CallExpressionNode = {
  type: 'CallExpression',
  value: string,
  params: (StringLiteralNode | CallExpressionNode)[]
  _context?: (StringLiteralNode | CallExpressionNode)[]
}

type ExpressionStatementNode = {
  type: 'ExpressionStatement',
  expression: {
    type: string,
    callee: {
      type: string,
      name: string,
    },
    arguments: any,
  }
}

type VisitorType<ChildNode, ParentNode> = {
  enter: (node: ChildNode, parent: ParentNode) => void,
  exit?: (node: ChildNode, parent: ParentNode) => void
}

type VisitorMethodType = {
  Program?: VisitorType<ProgramNode, null>,
  StringLiteral?: VisitorType<StringLiteralNode, ProgramNode | CallExpressionNode>,
  CallExpression?: VisitorType<CallExpressionNode, ProgramNode | CallExpressionNode>
}

export function parser(tokens: TokenType[]) {
  let current = 0

  function walk() {
    let token = tokens[current]

    if (token.type === 'name') {
      const node: CallExpressionNode = {
        type: 'CallExpression',
        value: token.value,
        params: []
      }

      token = tokens[++current]

      while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
        const nextNode = walk()
        if (nextNode) {
          node.params.push(nextNode)
        }
        token = tokens[current]
      }

      current++
      return node as CallExpressionNode
    }

    if (token.type === 'letter') {
      current++
      return {
        type: 'StringLiteral',
        value: token.value
      } as StringLiteralNode
    }

    if (token.type === 'paren' && token.value === '(') {
      current++
      return null
    }
  }

  const ast: ProgramNode = {
    type: 'Program',
    body: []
  }

  while (current < tokens.length) {
    ast.body.push(walk()!)
  }
  return ast
}

function traverser(ast: ProgramNode, visitor: VisitorMethodType) {

  function traverseArray(array: (StringLiteralNode | CallExpressionNode)[], parent: ProgramNode |  CallExpressionNode | StringLiteralNode | null) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node: CallExpressionNode | StringLiteralNode | ProgramNode, parent: ProgramNode | CallExpressionNode | StringLiteralNode | null) {

    const methods = visitor[node.type as keyof VisitorMethodType] ;

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node as ProgramNode);
        break;

      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      case 'StringLiteral':
        break;

      default:
        throw new TypeError(node);
    }

    if (methods && methods.exit) {
      methods.exit(node as any, parent);
    }
  }

  traverseNode(ast, null);
}

export function transformer(ast: ProgramNode) {

  const newAst = {
    type: 'Program',
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, {
    StringLiteral: {
      enter(node, parent) {
        parent!._context!.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    CallExpression: {
      enter(node, parent) {

        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.value,
          },
          arguments: [],
        };

        node._context = expression.arguments;

        if (parent.type !== 'CallExpression') {

          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          } as unknown as ExpressionStatementNode;
        }

        parent?._context!.push(expression);
      },
    }
  });

  return newAst;
}

export function codeGenerator(node: any) {

  switch (node.type) {

    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n').slice(1, -2)

    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) +
        ';' 
      );

    case 'CallExpression':
      return (
        '(' +
        node.arguments.map(codeGenerator)
          .join(' ' + CODE_MAP?.[node.callee.name as keyof typeof CODE_MAP] + ' ') +
        ')'
      );

    case 'Identifier':
      return '';

    case 'NumberLiteral':
      return node.value;

    case 'StringLiteral':
      return '' + node.value + '';

    default:
      throw new TypeError(node.type);
  }
}