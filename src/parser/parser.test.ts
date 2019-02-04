import { parse } from "./parse";
import { toTokens } from "./tokenizer-v2";

describe("Parser", () => {
  it("should", () => {
    const result = parse(`
      use atom Bar
      use atom ToolBar
      use material Card
      use @lazy material-ui Button

      component Icon {
        "no-args"
      }

      component Tab(id, title) {
        { $title }
        @content
      }

      component Lol is Tabe(id, title) {
        @content
      }
      
      component Tabs(tabs) is ToolBar {
        Icon
        { $text }
        "testo"
        @map $tabs to Tab($id, $title) {
          Icon($icon)
          Button {
            Icon($icon)
          }
        }
      }
    `);

    console.log(toTokens(result));
    // console.log(tokenizer(result).body);
  });
});
