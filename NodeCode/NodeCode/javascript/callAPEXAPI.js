var superagent = require("superagent");

// superagent
// .get("https://qa-myapex-oracleofferringdfte.deloitte.com/ords/dfteworkbench/projectdetails/project")
// .end((err, res) => {
//     console.log(res);
// });


(async () => {
    try {
      const res = await superagent.get('https://qa-myapex-oracleofferringdfte.deloitte.com/ords/dfteworkbench/projectdetails/project');
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  })();