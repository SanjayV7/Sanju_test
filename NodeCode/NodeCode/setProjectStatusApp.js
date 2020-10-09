var token = require('./javascript/generateToken.js');
var projStatus = require('./javascript/setProjStatus.js');

//Call procedure for create Project
token.getApexToken((res) => {
    if (res != undefined && res.status === "Success") {
        console.log("Generated APEX Token. Calling Set Project Status");

        //Call Provisioning API as part of this API
        projStatus.setProjStatus(res.message);
    }
    else {
        console.log("Error creating APEX Token");
    }
});