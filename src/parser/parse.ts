import { cond } from 'lodash/fp';

export enum Chars {
  LineEnd = 'LineEnd',
  ParenOpen = 'ParenOpen',
  ParenClose = 'ParenClose',
  BraceOpen = 'BraceOpen',
  BraceClose = 'BraceClose',
  WhiteSpace = 'WhiteSpace',
  Comma = 'Comma',
  Quote = 'Quote',
  DoubleQuote = 'DoubleQuote',
  Text = 'Text',
}

export interface SymbolToken {
  line: number;
  index: number;
  type: Chars;
}

export interface TextToken extends SymbolToken {
  value: string;
  end: number;
}

export type CharToken = SymbolToken | TextToken;

const toCharToken = cond<string, Partial<CharToken>>([
  [x => /\n/.test(x), () => ({ type: Chars.LineEnd })],
  [x => /\s/.test(x), () => ({ type: Chars.WhiteSpace })],
  [x => /[$@a-zA-Z0-9\-]/.test(x), (value: string) => ({ value, type: Chars.Text })],
  [x => /{/.test(x), () => ({ type: Chars.BraceOpen })],
  [x => /}/.test(x), () => ({ type: Chars.BraceClose })],
  [x => /\(/.test(x), () => ({ type: Chars.ParenOpen })],
  [x => /\)/.test(x), () => ({ type: Chars.ParenClose })],
  [x => /,/.test(x), () => ({ type: Chars.Comma })],
  [x => /'/.test(x), () => ({ type: Chars.Quote })],
  [x => /"/.test(x), () => ({ type: Chars.DoubleQuote })],
]);

export const isText = (token?: Partial<CharToken>): token is TextToken => Boolean(token && token.type === Chars.Text);

const joinTextTokens = (token: TextToken, next: TextToken) => ({
  ...token,
  value: token.value + next.value,
})

export const parse = (source: string): CharToken[] => {
  let index = 0;
  let line = 0;
  let current = 0;
  const elements: CharToken[] = [];
  while (index < source.length) {
    const char: string = source[index];
    let token = toCharToken(char);
    if (isText(token)) {
      token = { ...token, index: current };
      let next = toCharToken(source[++index]);
      while (isText(token) && isText(next)) {
        current++;
        token = joinTextTokens(token, next);
        next = toCharToken(source[++index]);
      }
      elements.push({ ...token, end: current, line } as CharToken)
      continue;
    }
    elements.push({ ...token, index: current, line } as CharToken)
    index++;
    current++;
    if (token.type === Chars.LineEnd) {
      line++;
      current = 0;
    }
  }

  return elements;
}