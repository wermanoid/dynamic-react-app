import React from "react";
import { observer } from "mobx-react";
import { observable, toJS } from "mobx";
import { mapValues, get, isArray } from "lodash";

import logo from "../logo.svg";

const getAtoms = (o: any) => Object.keys(o.atom);
const getGenerated = (o: any) => Object.keys(o.generate)[0];
const toAtom = (name: string) => `@atom/${name}`;

export interface BuilderProps {
  components: {
    atom: { [key: string]: React.ComponentType<any> };
  };
  config: {
    components: any;
    configurations: any;
  };
}

const data: any = {
  Tabs: {
    tabs: [
      { id: 1, icon: logo, title: "test1" },
      { id: 2, icon: logo, title: "test2" },
      { id: 3, icon: logo, title: "test3" }
    ]
  }
};

@observer
class Builder extends React.Component<BuilderProps> {
  @observable components: any = new Map();

  componentDidUpdate(prev: any) {
    if (prev.config !== this.props.config) {
      this.rebuild();
    }
  }

  render() {
    const results = Array.from(this.components.entries());

    return (
      <>
        {results.map(([name, Comp]: any) => {
          return <Comp key={name} {...data[name]} />;
        })}
      </>
    );
  }

  private rebuild = () => {
    const { config, components } = this.props;
    const cmp = toJS(config.components);
    const gen = getGenerated(cmp);
    const toBuild = cmp.generate[gen];

    let contentBuild = toBuild.content;
    if (toBuild.content.map) {
      const cnt = toBuild.content.map[1].content;
      const renderContent = (item: any) =>
        cnt.map((cont: any) => {
          if (typeof cont === "string") return cont;
          const prop = Object.keys(cont.props)[0];
          return React.createElement(
            components.atom[toAtom(cont.component)],
            { [prop]: get(item, [cont.props[prop]]) },
            null
          );
        });

      contentBuild = (data: any) =>
        get<any, string>(data, [toBuild.content.map[0]]).map((item: any) => {
          return React.createElement(
            components.atom[toAtom(toBuild.content.map[1].component)],
            mapValues(toBuild.content.map[1].props, (from, to) => {
              return to === "onClick"
                ? () => console.warn({ [from]: get(item, [from]) })
                : get(item, [from]);
            }),
            ...renderContent(item)
          );
        });
    }

    const result: any = (data: any) =>
      React.createElement(
        components.atom[toAtom(toBuild.wrapper.component)],
        toBuild.wrapper.props ? {} : undefined,
        ...contentBuild(data)
      );

    result.displayName = gen;
    this.components.set(gen, result);
  };
}

export default Builder;
