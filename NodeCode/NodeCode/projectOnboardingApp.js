var app = require('./javascript/projectOnboard.js');
var p_status = require('./javascript/json/Status.json');
var projectId = 1069;
var appArray = ['DCON,DPLOY'];
var operation = 'createApps';

app.getProjectOnboard(p_status, projectId, appArray, operation);
