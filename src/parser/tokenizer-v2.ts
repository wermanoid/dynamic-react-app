import { Tokens } from "./tokenizer";
import { CharToken, Chars, isText, TextToken } from "./parse";
import { filter, negate, matches, map } from "lodash/fp";

interface Context {
  index: number;
  tokens: CharToken[];
}
const toValues = map("value");
const dropWhiteSpaces = filter<CharToken>(
  negate(matches({ type: Chars.WhiteSpace }))
);

const toErrorString = ({ line, index }: CharToken) =>
  `at line ${line}, from position ${index}`;

function crawl(this: Context, expected?: { type: Chars }): any {
  this.index += 1;
  let token = this.tokens[this.index];
  if (expected && token.type !== expected.type) {
    this.index -= 1;
    return;
  }

  if (isText(token) || token.type === Chars.LineEnd) {
    return token;
  }

  if (token.type === Chars.ParenOpen) {
    const result = [];
    while (this.tokens[this.index].type !== Chars.ParenClose) {
      const value = crawl.call(this);
      value && result.push(value);
    }
    return result;
  }

  if (token.type === Chars.Comma) {
    return crawl.call(this);
  }

  if (token.type === Chars.DoubleQuote) {
    const result: any = [];

    this.index += 1;

    while (
      ((token = this.tokens[this.index]), token.type !== Chars.DoubleQuote)
    ) {
      // console.log({ token });
      isText(token) && result.push(token);
      this.index += 1;
    }
    // console.log({ result });
    return { type: Tokens.TextBlock, result: toValues(result).join(" ") };
  }

  if (token.type === Chars.BraceOpen) {
    const result = [];
    while (this.tokens[this.index].type !== Chars.BraceClose) {
      const value = crawl.call(this);
      value && result.push(value);
    }
    this.index += 1;
    return { type: Tokens.TokensBlock, result };
  }
}

function use(this: Context) {
  const result: any = { type: Tokens.UseDeclaration };
  const sourceOrModifier = crawl.call(this);
  if (!isText(sourceOrModifier))
    throw Error(
      `Incorrect use syntax ${toErrorString(this.tokens[this.index])}`
    );
  if (sourceOrModifier.value.startsWith("@")) {
    result.modifier = sourceOrModifier.value;
    result.source = crawl.call(this)!.value;
  } else {
    result.source = sourceOrModifier.value;
  }

  result.name = crawl.call(this)!.value;
  return result;
}
function component(this: Context) {
  const result: any = { type: Tokens.ComponentDeclaration };
  result.name = crawl.call(this)!.value;

  result.args = toValues(crawl.call(this, { type: Chars.ParenOpen }));

  result.wrapper = { component: "div" };
  const next = crawl.call(this, { type: Chars.Text });

  if (isText(next) && next.value === "is") {
    result.wrapper.component = crawl.call(this).value;
    result.wrapper.args = toValues(crawl.call(this, { type: Chars.ParenOpen }));
  }

  result.content = crawl.call(this, { type: Chars.BraceOpen });
  console.dir(result.content);
  return result;
}

const mapper: any = {
  use,
  component
};

function context(this: Context) {
  const final = [];
  while (this.index < this.tokens.length) {
    const token = this.tokens[this.index];
    if (isText(token)) {
      const flow = mapper[token.value];
      flow && final.push(flow.call(this));
    }
    this.index++;
  }
  return final;
}

export const toTokens = (tokens: CharToken[]) => {
  return context.call({
    tokens: dropWhiteSpaces(tokens),
    index: 0
  });
};
