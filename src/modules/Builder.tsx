import React from "react";
import { observer } from "mobx-react";
import { observable, toJS } from "mobx";
import { map, filter, get, find, reduce, getOr } from "lodash/fp";

import logo from "../logo.svg";

const atomFilter = filter({ type: "atom" });
const componentFilter = filter({ type: "component" });

const buildProps = (list: string[], props: any) =>
  reduce(
    (acc, prop) => {
      const name = prop.replace("$", "");
      const value = get(name, props);
      return { ...acc, [name]: value };
    },
    {},
    list
  );

export const buildWrapper = () => {};
export const buildComponent = () => {};

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
    src: logo,
    header: "This is sample",
    tabs: [
      { id: 1, src: logo, title: "test1", url: "lol1" },
      { id: 2, src: logo, title: "test2", url: "lol2" },
      { id: 3, src: logo, title: "test3", url: "lol3" }
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
    const atoms = map(
      (atom: any) => ({
        ...atom,
        renderer: get(["atom", `@atom/${atom.component}`], components)
      }),
      atomFilter(config.components)
    );
    const dynamics = componentFilter(config.components);
    const result = map((comp: any) => {
      console.log("creating", { atoms, comp });
      const resulted: React.SFC<any> = (props: any) => {
        const findAtom = (atomName: any) =>
          find({ component: atomName }, atoms);

        const wrap = findAtom(get(["wrapper", "component"], comp)) || {
          renderer: "div"
        };

        const wrapperProps = reduce(
          (acc, prop: string) => {
            const name = prop.replace("$", "");
            const value = get(name, props);
            return { ...acc, [name]: value };
          },
          {},
          wrap.props
        );
        const buildContent = (items: any[], dataProps: any): any => {
          let uId = 1;
          return map(item => {
            if (item.type === "atom") {
              const toRender = getOr(
                "div",
                ["renderer"],
                find({ component: item.component }, atoms)
              );
              return React.createElement(toRender, {
                ...buildProps(item.props, dataProps),
                key: uId++
              });
            }
            if (item.type === "interpolation") {
              return get([item.prop.replace("$", "")], dataProps);
            }
            if (item.type === "mapping") {
              const data = get(item.source.replace("$", ""), dataProps);
              return map(dataItem => {
                const container = findAtom(item.target.component) || {
                  renderer: "div"
                };
                const containerProps = reduce(
                  (acc, prop) => {
                    const name = prop.replace("$", "");
                    const value = get(name, dataItem);
                    return { ...acc, [name]: value };
                  },
                  {},
                  item.target.props
                );
                console.log(dataItem);
                return React.createElement(
                  container.renderer,
                  { ...containerProps, key: uId++ },
                  ...buildContent(item.target.content, dataItem)
                );
              }, data);
              // return null;
            }
            return null;
          }, items);
        };

        const content = buildContent(comp.content, props);
        console.log("lol", content);
        return React.createElement(wrap.renderer, wrapperProps, content);
      };
      resulted.displayName = comp.component;
      return resulted;
    }, dynamics);

    result.forEach((c: any) => this.components.set(c.displayName, c));

    console.log(result);
  };
}

export default Builder;
