import React, { useState } from "react";
import AppContext from "../config/Context";

import { genSearchItem, formateConfigParam } from "../util/generator";

const AppContextProvider = props => {

  const [tableSchema, setTableSchema] = useState([]); //table schema
  const [formattedSearchItem, setFormattedSearchItem] = useState(""); // formatted result of grid column

  // Set Setting Config Form Setting Comp Data
  const setSettingConfig = _data => { 
    const { tableSchema } = formateConfigParam(_data);
    setTableSchema(tableSchema); 
  };

  // Update Column Config For Config Table Comp
  const updateConfig = _tableSchema => { 
    setTableSchema(_tableSchema);
    const formattedSearchItem =  genSearchItem({tableSchema});
    setFormattedSearchItem(formattedSearchItem); 
  };

  return (
    <AppContext.Provider
      value={{
        tableSchema,
        formattedSearchItem,
        setSettingConfig,
        updateConfig
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
