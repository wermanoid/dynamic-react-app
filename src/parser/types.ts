import { SyntaxNode } from "./syntax";

export interface Composite<T> {
  state: CompositeState<T>;
  handle(nodes: SyntaxNode[]): number;
  children?: Composite<unknown>[];
}

export interface CompositeState<T> {
  ready(callback: (result: T) => void): this;
  use(context: Composite<T>, n: SyntaxNode): boolean;
}
