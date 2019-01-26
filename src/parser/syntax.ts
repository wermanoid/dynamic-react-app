import { filter, negate, matches, pipe } from "lodash/fp";

export interface SyntaxChar {
  line: number;
  index: number;
  type: string;
}

export interface SyntaxWord extends SyntaxChar {
  end: number;
  value: string;
}

export type SyntaxNode = SyntaxChar | SyntaxWord;

export const isWord = (node: null | SyntaxNode): node is SyntaxWord =>
  Boolean(node && node.type === "text");

const mapper: { [k: string]: Function } = {
  [","]: (line: number, index: number) => ({
    line,
    index,
    type: "comma"
  }),
  ["("]: (line: number, index: number) => ({
    line,
    index,
    type: "parens-open"
  }),
  [")"]: (line: number, index: number) => ({
    line,
    index,
    type: "parens-end"
  }),
  ["\n"]: (line: number, index: number) => ({ line, index, type: "new-line" }),
  [" "]: (line: number, index: number) => ({ line, index, type: "space" }),
  ["{"]: (line: number, index: number) => ({ line, index, type: "brace-open" }),
  ["}"]: (line: number, index: number) => ({
    line,
    index,
    type: "brace-end"
  }),
  default: (line: number, start: number, char: string) => ({
    line,
    index: start,
    end: start,
    type: "text",
    value: char
  })
};

const filterValuable = pipe([
  filter(negate(matches({ type: "space" }))),
  filter(negate(matches({ type: "new-line" }))),
  filter(negate(matches({ type: "comma" })))
]);

export const parse = (inp: string) => {
  let count = 0;
  let index = 0;
  let row = 0;
  const expressions: SyntaxNode[] = [];
  let last: null | SyntaxNode = null;
  while (count < inp.length) {
    const char = inp[count++];
    const factory = mapper[char];
    if (factory) {
      last && expressions.push(last);
      expressions.push(factory(row, index++));
      last = null;
      if (char === "\n") {
        row++;
        index = 0;
      }
      continue;
    }

    if (isWord(last)) {
      last = {
        ...last,
        end: index++,
        value: last.value + char
      } as SyntaxWord;
    } else {
      last = mapper.default(row, index++, char);
    }
  }

  return filterValuable(expressions);
};
