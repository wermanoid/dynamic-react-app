import { matches, filter, pipe, negate } from "lodash/fp";

import { CharToken, Chars, isText, TextToken } from "./parse";

const dropWhiteSpaces = filter(negate(matches({ type: Chars.WhiteSpace })));
const dropLineEndings = filter(negate(matches({ type: Chars.LineEnd })));
const isParenOpen = matches({ type: Chars.ParenOpen });
const isParenClose = matches({ type: Chars.ParenClose });

const cleanup = pipe([dropWhiteSpaces, dropLineEndings]);

export enum Tokens {
  Query = "Query",
  CallExpression = "CallExpression",
  UseDeclaration = "UseDeclaration",
  ContentDeclaration = "ContentDeclaration",
  ComponentDeclaration = "ComponentDeclaration",
  ArgumentsDeclaration = "ArgumentsDeclaration",
  TokensBlock = "TokensBlock",
  TextBlock = "TextBlock"
}

export interface Statement {
  type: Tokens;
}

export interface QueryStatement extends Statement {
  body: Statement[];
}

const chain: any = (items: any[], index: number = 0, aggr: any = {}) => ({
  get result() {
    return [index, aggr];
  },
  pipe(next: any, shift: number = 0) {
    const result = next(items[index + shift]);
    const nextIndex = result ? index + 1 : index;
    return chain(items, nextIndex + shift, {
      ...aggr,
      ...result
    });
  },
  if(cond: any, positive: any, negative?: any) {
    const final = chain(items, index + 1, aggr);
    if (cond(items[index])) {
      return positive(final);
    } else {
      return negative ? negative(final) : this;
    }
  },
  while(cond: any, func: any) {
    let last = index;
    let token = items[index];
    let result = null;
    while (!cond(token)) {
      result = { ...func(token, result) };
      last += 1;
      token = items[last];
    }
    return chain(items, last, { ...aggr, ...result });
  },
  join(wrap: any) {
    return wrap(this);
  }
});

const withArgs = (channel: any) =>
  channel.if(isParenOpen, (ch: any) =>
    ch.while(isParenClose, (token: any, result: any) => {
      if (token.type === Chars.Comma) return result;
      if (!result) {
        return { args: [token.value] };
      }
      return { args: [...result.args, token.value] };
    })
  );

const bodyExpressions: any = {
  use: (tokens: CharToken[]) =>
    chain(tokens, 0, {
      type: Tokens.UseDeclaration
    })
      .pipe(({ value }: any) => (value === "@lazy" ? { lazy: true } : null))
      .pipe(({ value }: any) => ({ source: value }))
      .pipe(({ value }: any) => ({ name: value })).result,
  component: (tokens: CharToken[]) =>
    chain(tokens, 0, { type: Tokens.ComponentDeclaration })
      .pipe(({ value }: any) => ({ name: value }))
      .join(withArgs).result
};

export const tokenizer = (syntax: CharToken[]): QueryStatement => {
  const tokens = cleanup(syntax);
  const root: QueryStatement = { type: Tokens.Query, body: [] };

  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];
    if (isText(token)) {
      const flow = bodyExpressions[token.value];
      if (flow) {
        const result = flow(tokens.slice(++index));
        if (result && result[0] > 0) {
          index += result[0];
          root.body.push(result[1]);
        }
        // console.log(result)
      } else {
        // console.log("non-flow-text", token);
        index++;
      }
    } else {
      // console.log("non-text-char", token);

      index++;
    }
  }
  return root;
};
