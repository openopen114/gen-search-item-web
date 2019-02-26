import * as _ from "lodash";

const prettier = require("prettier/standalone");
const plugins = [require("prettier/parser-babylon")];

//ignore entity colunm
export const ignoreColumnName = [
  "CREATE_TIME",
  "CREATE_USER",
  "LAST_MODIFIED",
  "LAST_MODIFY_USER",
  "TS",
  "DR"
];



export const genSearchItem = _state => {
  console.log('gen seatch item');
  const { tableSchema } = _state;


  let result = "";


  result += `<Row>`;


   tableSchema.map(item => {
      if (!ignoreColumnName.includes(item.columnName)) {
         const colName = _.camelCase(item.columnName);
         const searchItem = item.searchItem ? item.searchItem : 'none';

         switch(searchItem){
            case 'none': 
              result += `
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>${colName}</Label>
                            <FormControl placeholder='' {...getFieldProps('${colName}', {initialValue: ''})}/>
                        </FormItem>
                    </Col>
              `
              break;

             case 'Ref': 
              result += ` 
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>${colName}</Label>
                            <Ref${_.upperFirst(colName)} {...getFieldProps('${colName}', {initialValue: ''})}/>
                        </FormItem>
                    </Col>
              `
              break;  


             case 'InputNumber': 
              result += `  
                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>${colName}</Label>
                            <InputNumber min={0} iconStyle="one"
                                         {...getFieldProps('${colName}', {
                                             initialValue: "",
                                         })}
                            />
                        </FormItem>
                    </Col>
              `
              break; 

             case 'YearPicker': 
              result += `   
                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>年份</Label>
                            <YearPicker
                                {...getFieldProps('${colName}', {initialValue: ''})}
                                format="YYYY"
                                locale={zhCN}
                                placeholder="選擇年"
                            />
                        </FormItem>
                    </Col>
              `
              break; 


              case 'SelectMonth': 
              result += `   
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>月份</Label>
                            <SelectMonth {...getFieldProps('${colName}', {initialValue: ''})} />
                        </FormItem>
                    </Col>
              `
              break; 
              case 'Select': 
              result += `   
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>${colName}</Label>
                            <Select {...getFieldProps('${colName}', {initialValue: ''})}>
                                <Option value="">请选择</Option>
                                <Option value="0">0</Option>
                                <Option value="1">1</Option>
                            </Select>
                        </FormItem>
                    </Col>
              `
              break; 






         }


      }
    })


   result += `</Row>`;




  const formattedSearchItem = prettier.format(result, { parser: "babylon",  plugins })

  return formattedSearchItem;


}

 
 

export const formatTableSchemaToArray = _tableSchema => {
  let preprocessData = _.split(_tableSchema, "[");
  const patt = new RegExp("]");
  preprocessData = _.filter(preprocessData, item => patt.test(item));
  preprocessData = _.map(preprocessData, item => _.split(item, "]")[0]);

  preprocessData = _.filter(preprocessData, o => {
    return o !== "" && o !== "\n";
  });

  return preprocessData;
};

// Set Seeting Config For Setting Comp Data
export const formateConfigParam = _data => {
  const packageName = _.toLower(_data.packageName);
  const projectName = _.upperFirst(_.camelCase(_data.projectName));
  const tableName = _data.tableName;
  let tableSchema = _data.tableSchema;

  let map = new Map();

  map.set("VAR", "String");
  map.set("DEC", "Double");
  map.set("INT", "Integer");

  const tableSchemaArray = formatTableSchemaToArray(tableSchema);

  tableSchema = [];

  for (let i = 0; i < tableSchemaArray.length; i += 2) {
    let obj = {};
    obj.columnName = tableSchemaArray[i];
    obj.type = map.get(_.toUpper(tableSchemaArray[i + 1]).substring(0, 3));
    obj.key = tableSchemaArray[i];

    tableSchema.push(obj);
  }

  return { packageName, projectName, tableName, tableSchema };
};
