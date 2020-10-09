module.exports.updateProjectSG = function(access_token, status, projectId, callback){
    var request = require('request');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var options = {
      'method': 'POST',
      'url': 'https://qa-myapex-oracleofferringdfte.deloitte.com/ords/DFTEDEV_PDB1/dfteworkbench/projectdetails/projectsg',
      'headers':{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
      var status_body = {
        "p_project_name": status.p_project_name,
        "p_sg_status": status.p_sg_status,
        "p_sg_name1" : "SG-US-Oracle Offering DFTE-Project " + status.p_sg_name1 + "-" + projectId
        // "p_sg_name2" : "SG-US-Oracle Offering DFTE-Project " + status.p_sg_name2 + "-" + projectId,
        // "p_sg_name3" : "SG-US-Oracle Offering DFTE-Project " + status.p_sg_name3 + "-" + projectId,
    };
      options.body = JSON.stringify(status_body);
      // console.log(options);
    request(options, (error, response) => {
        if (error) {
            callback({ "status": "Error", "Message": err });
        } else {
            obj = JSON.parse(response.body);
            callback({"Status": "Success", "Message":obj.returnStatus});
            // console.log(response.body);
        }
      });
    }