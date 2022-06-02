const fs = require('fs');
// const db = require('./dbOp');

require('log-timestamp');
const { exec } = require("child_process");

const testLogFile = './tac_plus.acct';

console.log(`Watching for file changes on ${testLogFile}`);

const entryType = (entry) => {
    if (entry.includes('login-service')) {
        return 'login'
    } else if (entry.includes('cmd')) {
        return 'cmd'
    } else {
        return 'other'
    }
} 

fs.watchFile(testLogFile, (curr, prev) => {
    console.log(`${testLogFile} file Changed`);

    exec("Get-Content E:\\apps\\file-logger\\tac_plus.acct -Tail 1", { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);

        console.log(`Entry type: ${entryType(stdout)}`);

        // console.log(db.connection);

        const data = stdout.split('\t');

        console.log(data);

        // console.error(`stderr: ${stderr}`);
    })

});