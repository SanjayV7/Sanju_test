module.exports.getUipathToken = function (callback) {
    var request = require('request');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var uipath_options = {
        'method': 'POST',
        'url': 'https://qa-uipath-oracleofferingdfte.deloitte.com/api/Account/Authenticate',
        'headers': {
            'Content-Type': ['application/json']
        },
        body: ""
    };
    var body = {
        tenancyName: "DFTEQA",
        usernameOrEmailAddress: "",
        password: ""
    };
    body["usernameOrEmailAddress"] = "POC_AZURE_DEVOPS";
    body["password"] = "Azurepoc@123";
    uipath_options.body = JSON.stringify(body);

    //Generate API Token
    request(uipath_options, (err, res) => {
        if (err) {
            callback({ "status": "Error", "message": err });
        } else {

            obj = JSON.parse(res.body);
            uipath_token = obj.result;

            //Return Token
            callback({ "status": "Success", "message": obj.result});
        }
    });
}

module.exports.getApexToken = function (callback) {
    var request = require('request');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var username = '0D2Ns1_aYKHG0JXHF_QLrg..'
    var password = '4RZ-lzkvSPiMyTNSLsfv5A..'
    var options = {
        'method': 'POST',
        'url': 'https://qa-myapex-oracleofferringdfte.deloitte.com/ords/DFTEDEV_PDB1/dfteworkbench/oauth/token?grant_type=client_credentials',      
        'Content-Type': ['application/json'],
        'auth': {
            'user': username,
            'password': password
        }
    }

    request(options, (err, res) => {
        if (err) {
            //Return Error
            callback({ "status": "Error", "message": err });
        } else {

            obj = res.body;
            var apex_token = obj.access_token;

            console.log(apex_token);
            //Return Token
            callback({ "status": "Success", "message": JSON.parse(obj).access_token });
        }
    });
}