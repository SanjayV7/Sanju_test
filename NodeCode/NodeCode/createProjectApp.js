var token = require('./javascript/generateToken.js');
var project = require('./javascript/createProject.js');
var p_project = require('./javascript/json/Project.json');
var fs = require("fs");
var projectId = null;
var applicationName = null;


    
    console.log("Inside function"+p_project.P_CLIENT_NAME);
    // Start: Creating Project and generating projectOnboardingApp.js
    token.getApexToken((res) => {
    if (res != undefined && res.status === "Success") {
       project.callCreateProjectAPI(res, p_project,function(callback){
          response = callback;
          console.log("ResponseMessage :"+response);
          //Start: To get project Id and generate projectOnboardingApp.js
          if(response != null){
             console.log("Inside ProjectOnboardApp File Creation");
             var string = response;
             var obj = JSON.parse(string);
             projectId = obj.projdet[0].projectid;
             applicationName = obj.projdet[0].applications;
             console.log("ProjectId :"+projectId+"App Name :"+applicationName);
             //Start: Generate Js File
             const { prototype } = require("stream");
            //  var createStream = fs.createWriteStream("projectOnbardingApp.js");
            //  createStream.end();
             var writeStream = fs.createWriteStream("projectOnboardingApp.js");
             writeStream.write("var app = require('./javascript/projectOnboard.js');\r\n");
             writeStream.write("var p_status = require('./javascript/json/Status.json');\r\n");
             writeStream.write("var projectId = " + projectId + ";\r\n");
             writeStream.write("var appArray = ['"+applicationName+"'];\r\n");
             writeStream.write("var operation = 'createApps';\r\n");
             writeStream.write("\r\n");
             writeStream.write("app.getProjectOnboard(p_status, projectId, appArray, operation);\r\n");
             writeStream.end();
             //END: Generate Js File
          }
          else{
             console.log("Inside Else");
          }
          //End: To get project Id and generate projectOnboardingApp.js
       });

    }
    else {
       console.log("Error creating APEX Token");
    }
    });
    //End: Creating Project and generating projectOnboardingApp.js

