module.exports.getProjectOnboard = function (p_status, projectId, appArray, operation) {

    let pOnboard = require('./processOnboarding.js');
    var updpsg = require('./updateProjSG.js');
    var token = require('./generateToken.js');

    token.getApexToken((res) => {
        if (res != undefined && res.status === "Success") {

            console.log("Generated APEX Token. Calling Update Proj SG");
            console.log('APEX Token - ' + res.message);

            updpsg.updateProjectSG(res.message, p_status, projectId, function (res) {
                if (res != undefined && res.Message === "S") {

                    console.log("Update Proj SG Successful. Generating Uipath Token");

                    token.getUipathToken((uipath_res) => {
                        if (uipath_res.status === "Success") {
                            console.log("Calling Process Onboarding");
                            pOnboard.processOnboarding(projectId, p_status.p_project_name, uipath_res.message, appArray, operation);
                        } else {
                            console.log("Error creating UIPath Token");
                        }
                    });
                } else {
                    console.log("Error updating status of Project SG");
                }
            });
        } else {
            console.log("Error creating APEX Token");
        }
    });
}