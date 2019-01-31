import { parse } from "./syntax";
import { getBlockComposite } from "./composites/block-composite";

const blocks = `{
  a b c
  { d e f } 
}`;

describe("composite", () => {
  it("works", () => {
    const nodes = parse(blocks, false);
    const block = getBlockComposite();
    const shift = block.handle(nodes);
    console.log({ shift, blocks: (block as any).result });
    console.log(blocks[shift - 1] === "\n", blocks[shift]);
  });
});
