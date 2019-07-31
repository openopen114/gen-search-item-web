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
  "DR",
  "TENANT_ID"
];



export const genSearchItem = _state => {
  console.log('gen seatch item');
  const { tableSchema, projectName } = _state;
  console.log(projectName)


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
                            <Label>{<FormattedMessage id="js.${projectName}.search.00XX" defaultMessage="${colName}"/>}</Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.${projectName}.search.placeholder.00XX", defaultMessage:'精确查询'})} {...getFieldProps('${colName}', { initialValue: '' })} />
                        </FormItem>
                    </Col> 
              `
              break;

             case 'Ref': 
              result += ` 

                    <Col md={4} xs={6}>
                        <FormItem >
                            <Label>{<FormattedMessage id="js.${projectName}.search.00XX" defaultMessage="${colName}"/>}</Label>
                            <Ref${_.upperFirst(colName)}
                                placeholder={this.props.intl.formatMessage({id:"js.${projectName}.search.placeholder.00XX", defaultMessage:'選擇${colName}'})}
                                {...getFieldProps('${colName}', { initialValue: '' })} 
                            />
                        </FormItem>
                    </Col> 
              `
              break;  


             case 'InputNumber': 
              result += `  

                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>{<FormattedMessage id="js.${projectName}.search.00XX" defaultMessage="${colName}"/>}≥</Label>
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
                            <Label>{<FormattedMessage id="js.${projectName}.search.00XX" defaultMessage="年份"/>}</Label>
                            <YearPicker
                                {...getFieldProps('${colName}', {initialValue: ''})}
                                format="YYYY"
                                locale={zhCN}
                                placeholder={this.props.intl.formatMessage({id:"js.search.sel1.0001", defaultMessage:'選擇年'})}
                            />
                        </FormItem>
                    </Col>


 
              `
              break; 


              case 'SelectMonth': 
              result += `   

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>{<FormattedMessage id="js.${projectName}.search.00XX" defaultMessage="月份"/>}</Label>
                            <SelectMonth  {...getFieldProps('${colName}', { initialValue: '' })} />
                        </FormItem>
                    </Col>
 
              `
              break; 
              case 'Select': 
              result += `  

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>{<FormattedMessage id="js.${projectName}.search.0006" defaultMessage="${colName}"/>}</Label>
                            <Select {...getFieldProps('${colName}', { initialValue: '' })}>
                                <Option value="">{<FormattedMessage id="js.${projectName}.search.sel.00XX" defaultMessage="請選擇"/>}</Option>
                                <Option value="0">{<FormattedMessage id="js.${projectName}.search.sel.00XX" defaultMessage="0"/>}</Option>
                                <Option value="1">{<FormattedMessage id="js.${projectName}.search.sel.00XX" defaultMessage="1"/>}</Option>
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
  const projectName = _data.projectName;
  const tableName = _data.tableName;
  let tableSchema = _data.tableSchema;

  let map = new Map();

  map.set("VAR", "String");//VARCHAR
  map.set("DEC", "Double");//DECIMAL
  map.set("INT", "Integer");//INT
  map.set("NVA", "String");//NVARCHAR
  map.set("CHA", "String");//CHAR
  map.set("BIT", "Boolean"); //BIT
 

  const tableSchemaArray = formatTableSchemaToArray(tableSchema);

  tableSchema = [];

  for (let i = 0; i < tableSchemaArray.length; i += 2) {
    let obj = {};
    obj.columnName = tableSchemaArray[i];
    obj.type = map.get(_.replace(tableSchemaArray[i + 1], 'TYPE_', '').trim().substring(0, 3)) ? map.get(_.replace(tableSchemaArray[i + 1], 'TYPE_', '').trim().substring(0, 3)) : 'String';
    obj.key = tableSchemaArray[i];

    tableSchema.push(obj);
  }

  return { projectName,  tableSchema };
};
