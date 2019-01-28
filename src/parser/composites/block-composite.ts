import { Composite } from "../types";
import { getBlockState } from "../states/block-state";
import { SyntaxNode } from "../syntax";

export interface BlockComposite extends Composite<SyntaxNode[]> {
  result: SyntaxNode[];
}

export const getBlockComposite = (): BlockComposite => {
  const block: BlockComposite = {
    state: getBlockState().ready(r => {
      block.result = r;
    }),
    result: [] as SyntaxNode[],
    handle(nodes: SyntaxNode[]) {
      let i = 0;
      while (this.state.use(this, nodes[i])) {
        i++;
      }
      delete this.state;
      return i;
    }
  };

  return block;
};
