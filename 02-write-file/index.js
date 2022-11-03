const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

const fileDir = __dirname;
const fileName = 'task_2.txt';

const file = path.join(fileDir, fileName);

const output = fs.createWriteStream(file, {
    encoding: 'utf-8',
});

stdout.write('Hi! Write something!\n');

stdin.on('data', data => {
    const text = data.toString();
    if (text.slice(0, -2) === 'exit') {
        process.on('exit', () => {
            stdout.write('Good luck!');
        });
        process.exit();
    }
    process.on('SIGINT', () => {
        console.log('Good luck!');
        process.exit();
    });
    output.write(text);
});

