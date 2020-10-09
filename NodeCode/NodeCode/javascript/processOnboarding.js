var users = require("./json/userAssign.json");
var Dirs = require("./json/createDir.json");
var appUserSGArr = require("./json/appUserSG.json");
const { Console } = require("console");

const addUser = (folderID, user_name, api_key) => {
    var request = require('request');
    var options = {
        "method": "POST",
        "url": "https://qa-uipath-oracleofferingdfte.deloitte.com/odata/Folders/UiPath.Server.Configuration.OData.AssignDomainUser?",
        "headers": {
            "Content-Type": "application/json"
        }
    };

    options.headers["Authorization"] = 'Bearer ' + api_key;
    var folder_body = { "assignment": { "Domain": "us", "UserName": "", "UserType": "DirectoryGroup", "RolesPerFolder": [{ "FolderId": "" }] } };
    folder_body["assignment"]["UserName"] = user_name;
    folder_body["assignment"]["RolesPerFolder"][0]["FolderId"] = folderID;
    options.body = JSON.stringify(folder_body);
    request(options, function (error, response) {
        if (error) throw new Error(error);
        try {
            obj3 = response.body;
            // console.log("Grant access to User - Success:" + JSON.stringify(response.body));
        } catch (error) {
            console.log("Error granting role to User - " + error);
        }
    });
}

const createFolder = (api_key, file_name, folderDesc, projectId, appArray) => {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://qa-uipath-oracleofferingdfte.deloitte.com/odata/Folders',
        'headers': {
            'Content-Type': 'application/json',
        },
        body: "",
    };
    var Folderbody = { "DisplayName": "", "FullyQualifiedName": "", "Description": "", "ProvisionType": "Manual", "PermissionModel": "InheritFromTenant", "ParentId": null, "Id": 0 };
    Folderbody["DisplayName"] = file_name;
    Folderbody["FullyQualifiedName"] = file_name;
    Folderbody["Description"] = folderDesc;
    options.body = JSON.stringify(Folderbody);
    options.headers["Authorization"] = 'Bearer ' + api_key;
    // console.log(options);
    request(options, function (error, response) {
        if (error) {
            console.log("Error creating folder - " + file_name);
            console.log(error);
        } else {
            obj2 = JSON.parse(response.body);
            // console.log(obj2);

            if (obj2.hasOwnProperty("errorCode")) {
                if (obj2.errorCode == "1001") {
                    console.log(obj2.message);
                }
            } else if (obj2.hasOwnProperty("DisplayName") && obj2.hasOwnProperty("Id")) {
                folderID = obj2.Id;
                // console.log(file_name + "created successfully with Folder ID: " + folderID);

                //Call User Assign
                Dirs.roles.forEach((i) => {
                    let groupName = "SG-US-Oracle Offering DFTE-Project " + i + "-" + projectId;
                    addUser(folderID, groupName, api_key);
                });
                users.UserName.forEach((obj) => {
                    addUser(folderID, obj, api_key);
                });
                appArray.forEach((appCode) => {
                    var sgResult = appUserSGArr.find(item => {
                        return item.appName == appCode;
                    });
                    if (sgResult != undefined) {
                        addUser(folderID, sgResult.sgName, api_key);
                    }
                });
            }
        }
    });
}

const getFolderId = (api_key, folderName, folderDesc, projectId, appArray) => {
    console.log("Checking if Folder Exists");
    var request = require('request');
    var options = {
        "method": "GET",
        "url": "https://qa-uipath-oracleofferingdfte.deloitte.com/odata/Folders?$filter=DisplayName eq '" + folderName + "'",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key
        },
        body: "",
    };

    request(options, (err, res) => {
        if (err) {
            console.log("Error searching for Folder - " + err);
        } else {
            var resBody = JSON.parse(res.body);

            if (resBody.hasOwnProperty("value") && Object.keys(JSON.parse(res.body).value).length > 0) {
                var folderID = (JSON.parse(res.body).value)[0].Id;
                // console.log("Length - " + Object.keys((JSON.parse(res.body).value)[0]).length);
                // console.log("Folder Id - " + folderID);

                //Call User Assign
                console.log("Folder Id " + folderID + " Found. Granting folder access to users");
                Dirs.roles.forEach((i) => {
                    let groupName = "SG-US-Oracle Offering DFTE-Project " + i + "-" + projectId;
                    addUser(folderID, groupName, api_key);
                });
                users.UserName.forEach((obj) => {
                    addUser(folderID, obj, api_key);
                });
                appArray.forEach((appCode) => {
                    var sgResult = appUserSGArr.find(item => {
                        return item.appName == appCode;
                    });
                    if (sgResult != undefined) {
                        addUser(folderID, sgResult.sgName, api_key);
                    }
                });
            }
            else {
                console.log("Creating Folder and granting access to users");
                createFolder(api_key, folderName, folderDesc, projectId, appArray);
            }
        }
    })
}

const createDirectoryGroup = (api_key, group, roles) => {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://qa-uipath-oracleofferingdfte.deloitte.com/odata/Users',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: "",
    };
    var DirectoryGroupbody = {
        "UserName": "", "Domain": "us", "RolesList": ["DFTEAppTeamMonitor"],
        "OrganizationUnits": [], "Type": "DirectoryGroup", "MayHaveRobotSession": false, "MayHaveUserSession": true
    };
    DirectoryGroupbody["UserName"] = group;
    DirectoryGroupbody["RolesList"] = [];
    DirectoryGroupbody["RolesList"].push(roles);
    options.body = JSON.stringify(DirectoryGroupbody);
    options.headers["Authorization"] = 'Bearer ' + api_key;
    // console.log(options);

    request(options, function (error, response) {
        if (error) throw new Error(error);
        obj2 = JSON.parse(response.body);
        // console.log(obj2);

        if (obj2.hasOwnProperty("errorCode")) {
            if (obj2.errorCode == "1001") {
                console.log(obj2.message);
            }
        } else if (obj2.hasOwnProperty("UserName") && obj2.hasOwnProperty("Id")) {
            groupID = obj2.Id;
            groupKey = obj2.Key;
            // console.log(group + " created successfully with ID: " + groupID + " ,Key:" + groupKey);
        }
    });
}

function callUiPath(projectId, projectName, api_key, appArray) {
    console.log("UiPath - Create Folders");

    //Call Directory Group Creation
    Dirs.roles.forEach((i) => {
        let groupName = "SG-US-Oracle Offering DFTE-Project " + i + "-" + projectId;
        let roleName = "DFTE-" + i;
        createDirectoryGroup(api_key, groupName, roleName);
    });

    //Check Folder and create accordingly
    getFolderId(api_key, 'PRJ' + projectId, projectName, projectId, appArray);
}

function assignSGRoles(projectID, appName, action, callback) {
    try {
        const Shell = require('node-powershell');
        const path = require("path");

        const ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });

        var filename = path.join(__dirname, '../') + "\applications\\powershell\\FileShare\\manageProject.ps1"
            , result
            , command = "&'" + filename + "'"
            ;
        console.log(projectID, appName, action);
        ps.addCommand(command
            , [{ name: 'projectID', value: projectID }
                , { name: 'apps', value: appName }
                , { name: 'action', value: action }
                , { name: 'file', value: path.join(__dirname, '../') + "\applications\\powershell\\FileShare\\folderDetails.json" }]);

        var x_err;
        // console.log(ps.commands);
        ps.invoke()
            .then(output => {
                callback({ status: "Success", message: "Role assignment to Security Groups Successful" });
                ps.dispose();
            })
            .catch(err => {
                x_err = { status: "Error", message: err.name };
                callback(x_err);
                ps.dispose();
            })
            ;
        return x_err;
    } catch (err) {
        console.log("In Catch " + err);
    }
}

module.exports.processOnboarding = function (projectId, projectName, api_key, appArray, operation) {
    console.log("Submitting Onboarding Scripts");

    callUiPath(projectId, projectName, api_key, appArray);

    appArray.forEach((appName) => {
        assignSGRoles(projectId, appName, operation, (res) => {
            if (res != undefined) {
                if (res.status === "Success") {
                    console.log(appName + ",  " + res.message);
                } else {
                    console.log(appName + ", Error - " + res.message);
                }
            }
        });
    });
}