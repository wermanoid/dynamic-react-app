import React, { createContext } from "react";
import { observable, IObservableObject } from "mobx";

import ToolBar from "../atom/ToolBar";
import Icon from "../atom/Icon";

export enum PredefinedComponents {
  Icon = "@atom/Icon",
  ToolBar = "@atom/ToolBar"
}

export type ComponentMap = {
  [key in PredefinedComponents]: React.ComponentType<any>
};

export interface ComponentsHierarchy {
  atom: ComponentMap;
  dynamic: IObservableObject;
}

const components: ComponentsHierarchy = {
  atom: {
    [PredefinedComponents.ToolBar]: ToolBar,
    [PredefinedComponents.Icon]: Icon
  },
  dynamic: observable({})
};

const ComponentStoreContext = createContext<ComponentsHierarchy>(components);

export const ComponentStore: React.SFC = ({ children }) => (
  <ComponentStoreContext.Provider value={components}>
    {children}
  </ComponentStoreContext.Provider>
);

export const ComponentEntires = ComponentStoreContext.Consumer;
