import { SyntaxNode } from "./syntax";
import { Composite, CompositeState } from "./types";

// export const state = (): CompositeState<Composite> => ({
//   use(context: Composite, node: SyntaxNode) {
//     return false;
//   }
// });

export const composite = (state: CompositeState<unknown>): any => ({
  state
});

export const compose = (
  nodes: SyntaxNode[],
  root: Composite<any>
): Composite<any> => {
  return root;
};
