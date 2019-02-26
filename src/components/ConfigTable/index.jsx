import React, { useContext } from "react";

import AppContext from '../../config/Context'

import { Table, Select, Checkbox   } from "antd";
import { Button } from 'antd';

import "./index.scss";
 
const Option = Select.Option;


const ConfigTable = () => {
  //App context 
  const { tableSchema, updateConfig } = useContext(AppContext);


  //handle change event
  const handleChange = (_type, _index, _value) => {
    // console.log(`type:${_type} index:${_index} value:${_value}`);
 

    const config = {}
  
    switch(_type){
      case "sorter":
        config[_type] = _value.target.checked;
        break;
      default:
        config[_type] = _value;
    }

    


    tableSchema[_index] = {
      ...tableSchema[_index],
      ...config
    };

  }



  const updateColumnConfig = () => { 
    updateConfig(tableSchema)
  }


  const columns = [
      {
        title: "Column Name",
        dataIndex: "columnName",
        key: "columnName"
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "SearchItem",
        key: "SearchItem",
        render: (text, record, index) => (
          <Select defaultValue="none" style={{ width: 120 }} onChange={handleChange.bind(this, 'searchItem', index)}>
            <Option  value="none">none</Option>
            <Option value="Ref">Ref</Option>
            <Option value="InputNumber">InputNumber</Option> 
            <Option value="YearPicker">YearPicker</Option>
            <Option value="SelectMonth">SelectMonth</Option>  
            <Option value="Select">Select</Option> 
          </Select>
        )
      } 
    ];


    return (
      <div className="annotation-table">
        <h1 className="text-gradient">@ Annotation</h1>
        <Table columns={columns} dataSource={tableSchema} pagination={false} />
        <Button type="primary" onClick={updateColumnConfig}>Generate Search Item</Button>
      </div>
    );












}

  
export default ConfigTable;
