import React, { createContext } from "react";
import { observable, IObservableObject } from "mobx";

import ToolBar from "../atom/ToolBar";
import Tab from "../atom/Tab";
import Icon from "../atom/Icon";

export enum PredefinedComponents {
  Tab = "@atom/Tab",
  ToolBar = "@atom/ToolBar",
  Icon = "@atom/Icon"
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
    [PredefinedComponents.Tab]: Tab,
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
