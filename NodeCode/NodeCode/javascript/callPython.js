var { PythonShell } = require('python-shell');
var path = require('path');
var dirpath = path.join(__dirname, '../') + "\applications\\python\\scripts\\"

// console.log(dirpath);

var options = {
    mode: 'text',
    scriptPath: dirpath,
    pythonOptions: ['-u'], // get print results in real-time
    args: ["SampleCode"]
  };

PythonShell.run('test.py', options, function(err, results){
    if (err) {
        console.log('Error executing python script');
    }
    console.log(results[0]);
})