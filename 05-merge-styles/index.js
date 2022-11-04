const path = require('path');
const fs = require('fs/promises');
const stream = require('fs');


async function createBundle() {
    const styleDir = path.join(__dirname, 'styles');
    const files = await fs.readdir(styleDir, {
        withFileTypes: true
    });
    const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
    const output = stream.createWriteStream(bundle, {
        encoding: 'utf-8',
    });
    for (const file of files) {
        let sourceFile = path.join(styleDir, file.name);
        let fileExt = path.extname(sourceFile);
        if (!file.isDirectory() && fileExt === '.css') {
            const input = stream.createReadStream(sourceFile, 'utf-8');
            input.on('data', chunk => output.write(chunk))
        }
    }
}

createBundle().then(() => console.log("Bundle create"));