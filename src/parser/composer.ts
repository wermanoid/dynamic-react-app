import { SyntaxNode, SyntaxWord, isWord } from "./syntax";
import { map } from "lodash/fp";

export enum Kyewords {
  atom = "atom",
  interpolation = "interpolation",
  component = "component",
  map = "@map"
}

export const toValues = map("value");

export const parensAggr = () => ({
  opened: false,
  closed: false,
  result: [] as any[],
  use(n: SyntaxNode) {
    if (this.closed) {
      return false;
    }

    if (!this.opened && n.type === "parens-open") {
      this.opened = true;
      return true;
    }

    if (!this.opened && n.type !== "parens-open") {
      return false;
    }

    if (this.opened && n.type === "parens-end") {
      this.closed = true;
      return true;
    }

    if (n.type !== "parens-end") {
      this.result.push(n);
      return true;
    }
    return false;
  },
  build() {
    return this.result;
  }
});

export const wrapperAggr = () => ({
  defined: false,
  component: null as any,
  props: parensAggr(),
  use(n: SyntaxNode) {
    if (!this.defined && isWord(n) && n.value === "is") {
      this.defined = true;
      return true;
    }
    if (this.defined) {
      if (!this.component && isWord(n)) {
        this.component = n.value;
        return true;
      }
      if (this.props.use(n)) {
        return true;
      }
    }
    return false;
  },
  build() {
    return {
      component: this.component || "div",
      props: toValues(this.props.build())
    };
  }
});

export const blockAggr = () => ({
  opened: 0,
  closed: 0,
  content: [] as any[],
  use(n: SyntaxNode) {
    if (n.type === "brace-open") {
      this.opened += 1;
      if (this.opened === 1) return true;
    }

    if (n.type === "brace-end") {
      this.closed += 1;
      if (this.opened === this.closed) return false;
    }

    this.content.push(n);
    return true;
  },
  build() {
    return this.content;
  }
});

export const atom = (nodes: SyntaxNode[]) => {
  const result = { component: null, props: null, type: "atom" } as any;
  let i = 0;
  const nameNode = nodes[i];
  if (isWord(nameNode)) {
    result.component = nameNode.value;
    i++;
  }
  const props = parensAggr();

  while (props.use(nodes[i])) {
    i++;
  }
  result.props = toValues(props.build());

  return [result, i];
};

export const mapper = (nodes: SyntaxNode[]) => {
  const result = { type: "mapping", source: null, target: null } as any;
  let i = 1;
  let node = nodes[i];
  if (isWord(node)) {
    result.source = node.value;
    node = nodes[++i];
  }

  if (isWord(node) && node.value === "to") {
    const [cmp, len] = component(nodes.slice(i + 1), true);
    result.target = cmp;
    i += len + 1;
  }
  return [result, i];
};

export const contentFlow: any = {
  [Kyewords.map]: mapper
};

export const contentAggr = (nodes: SyntaxNode[]) => {
  const result = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "brace-open") {
      const block = blockAggr();
      while (block.use(nodes[i])) {
        i++;
      }
      result.push({
        type: Kyewords.interpolation,
        prop: toValues(block.build())[0]
      });
    }

    if (isWord(node)) {
      const flow = contentFlow[node.value];
      if (flow) {
        const [item, len] = flow(nodes.slice(i));
        result.push(item);
        i += len - 1;
      } else {
        const [item, len] = atom(nodes.slice(i));

        result.push(item);
        i += len - 1;
      }
    }
  }

  return result;
};

export const component = (nodes: SyntaxNode[], noWrap: boolean = false) => {
  const result = {
    component: null,
    wrapper: null,
    props: null,
    content: null,
    type: "component"
  } as any;
  let i = 0;
  const nameNode = nodes[i];
  if (isWord(nameNode)) {
    result.component = nameNode.value;
    i++;
  }

  const props = parensAggr();

  while (props.use(nodes[i])) {
    i++;
  }
  result.props = toValues(props.build());

  if (!noWrap) {
    const wrapper = wrapperAggr();

    while (wrapper.use(nodes[i])) {
      i++;
    }

    result.wrapper = wrapper.build();
  }

  const content = blockAggr();

  while (content.use(nodes[i])) {
    i++;
  }

  result.content = contentAggr(content.build());

  return [result, i];
};

export const flows: { [k: string]: any } = {
  [Kyewords.atom]: atom,
  [Kyewords.component]: component
};

export const compose = (nodes: SyntaxNode[]) => {
  const result = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isWord(node)) {
      const flow = flows[node.value];
      if (flow && i < nodes.length - 1) {
        const passed = flow(nodes.slice(i + 1));
        i += passed[1];
        result.push(passed[0]);
      }
    }
  }
  return result;
};
