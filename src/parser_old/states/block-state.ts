import { CompositeState, Composite } from "../types";
import { SyntaxNode, Symbols } from "../syntax";

interface Counters {
  open: number;
  close: number;
}

type OnReady = (result: SyntaxNode[]) => void;

const handlers: Partial<{ [key in Symbols]: (c: Counters) => Counters }> = {
  [Symbols.BlockStart]: ({ open, close }: Counters) => ({
    close,
    open: open + 1
  }),
  [Symbols.BlockEnd]: ({ open, close }: Counters) => ({
    open,
    close: close + 1
  })
};

export const getBlockState = (): CompositeState<SyntaxNode[]> => {
  const state = {
    counters: {
      open: 0,
      close: 0
    },
    get closed() {
      return this.counters.close === this.counters.open;
    },
    result: [] as SyntaxNode[],
    onReady: null as null | OnReady,
    ready(callback: OnReady) {
      this.onReady = callback;
      return this;
    },
    use(_: Composite<SyntaxNode[]>, node: SyntaxNode) {
      if (!node) return false;
      const handler = handlers[node.type];

      if (handler) {
        this.counters = handler(this.counters);
      }

      if (!this.closed) {
        this.result.push(node);
        return true;
      }

      if (this.onReady) this.onReady(this.result.slice(1));
      return false;
    }
  };

  return state;
};
