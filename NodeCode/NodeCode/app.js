console.log("Hello Azure");
console.log(process.env.APEXDBURL);
console.log(process.env.USERNAME);
console.log(process.env.PASSWORD);
var fs = require("fs");
var projectName = null;

const json = '{"p_project_name":true, "p_sg_status":"ACTIVE","p_sg_name1": "User"}';

//Start: To generate json files 
const csv = require('csv-parser');
const fs1 = require('fs');
let jsonVal = null;
// Reading CSV file
fs1.createReadStream('./Values.csv')
  .pipe(csv())
  .on('data', (row) => {
      jsonVal = row;
      let data = JSON.stringify(jsonVal, null, 2);
      projectName = row.P_PROJECT_NAME;
      fs1.writeFile('./javascript/json/Project.json', data, (err) => {
         if (err) throw err;
      });
   })
  .on('end', () => {
    console.log('CSV file successfully processed');
    //Creating Status.json
    if(projectName != null){
      var writeStream = fs.createWriteStream("./javascript/json/Status.json");
      writeStream.write("{\r\n");
      writeStream.write('"p_project_name" :' +'"'+projectName+'",\r\n');
      writeStream.write('"p_sg_status" : "ACTIVE",\r\n');
      writeStream.write('"p_sg_name1" : "User"\r\n');
      writeStream.write("}\r\n");
      writeStream.end();
    }else{
      console.log("Inside else");
    }
    //Creating Status.json
    

  })
//End: To generate json files 

   




   




;

