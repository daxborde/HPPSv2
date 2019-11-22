import { PythonShell } from 'python-shell';

export default function runMainPy() {
  console.log("madeit!");
  // var python = require('child_process').spawn('python', ['./main.py']);
  // python.stdout.on('data',function(data){
  //     console.log("data: ",data.toString('utf8'));
  // });

  PythonShell.run('./main.py', null, (err, results) => {
    if  (err)  throw err;
    console.log('main.py finished.');
    console.log('results', results);
  });
}
