import { CompositeState, Composite } from "../types";
import { SyntaxNode, Symbols, isWord } from "../syntax";

export type ArgsStateCallback = (args: string[]) => void;

export const getArgsState = (
  next?: CompositeState<unknown>
): CompositeState<string[]> => {
  const result = {
    onReady: null as null | ArgsStateCallback,
    ready(callback: ArgsStateCallback) {
      this.onReady = callback;
      return this;
    },
    opened: false,
    result: [] as string[],
    use(context: Composite<unknown>, node: SyntaxNode) {
      if (!this.opened && node.type === Symbols.ParensStart) {
        this.opened = true;
        return true;
      }
      if (this.opened && isWord(node)) {
        this.result.push(node.value);
        return true;
      }
      if (this.opened && node.type === Symbols.ParensEnd) {
        this.closed = true;
        if (next) {
          context.state = next;
        }
        this.onReady && this.onReady(this.result);
        return false;
      }
      return false;
    }
  };

  return result as CompositeState<string[]>;
};
