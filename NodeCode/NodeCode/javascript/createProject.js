module.exports.callCreateProjectAPI = function(api_key, p_project,callback) {
    var request = require('request');
    var options = {
        "method": "POST",
            "url":"https://qa-myapex-oracleofferringdfte.deloitte.com/ords/DFTEDEV_PDB1/dfteworkbench/projectdetails/project",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + api_key.message
            },
            body: JSON.stringify(p_project),
    };
    request(options, (err, res) => {
        if (err) {
            console.log("Error calling APEX API for createProject" + err);
            callback("Error while project creation :"+err);
        } else {
            console.log("Project Create / Update Successful");
            callback(res.body);
        }
    });

    
};



