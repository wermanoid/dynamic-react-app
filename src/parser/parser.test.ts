import { parse } from "./parse";
import { tokenizer } from "./tokenizer";

describe("Parser", () => {
  it("should", () => {
    const result = parse(`
      use atom Bar
      use atom ToolBar
      use material Card
      use @lazy material-ui Button

      component Tab(id, title) {
        { $title }
        @content
      }
      
      component Tabs(tabs) is ToolBar {
        Icon
        { $text }
        "text"
        @map $tabs to Tab($id, $title) {
          Icon($icon)
          Button {
            Icon($icon)
          }
        }
      }
    `);

    // console.log(tokenizer(result));
    console.log(tokenizer(result).body);
  });
});