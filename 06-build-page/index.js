const fs = require('fs');
const path = require('path');
const stream = require("fs");
let tempStr = '';
const buildPath = path.join(__dirname, 'project-dist');

async function createHtmlBundle() {
    createDir().then(() => console.log("Dir create"));
    createBundle().then(() => console.log("Bundle create"));
    copyDir('assets').then(() => console.log('Dir copied!'))
    const file = path.join(__dirname, 'template.html');
    const input = fs.createReadStream(file);
    input.on('data', chunk => {
        tempStr += chunk.toString();
        writeTemplate(tempStr);
    })
}

async function writeTemplate(data) {
    try {
        const files = await fs.promises.readdir(__dirname + '/components', {
            withFileTypes: true
        });
        for (const file of files) {
            if (!file.isDirectory()) {
                let filePath = path.join(__dirname + '/components', file.name);
                let name = file.name.split('.')[0];
                const input = fs.createReadStream(filePath);
                input.on('data', dat => {
                    const output = fs.createWriteStream(buildPath + '/index.html');
                    data = data.replace(`{{${name}}}`, dat.toString());
                    output.write(data);
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function createDir() {
    await fs.promises.mkdir(buildPath, {recursive: true});
}

async function createBundle() {
    const styleDir = path.join(__dirname, 'styles');
    const files = await fs.promises.readdir(styleDir, {
        withFileTypes: true
    });
    const bundle = path.join(__dirname, 'project-dist', 'style.css');
    const output = stream.createWriteStream(bundle);
    for (const file of files) {
        let sourceFile = path.join(styleDir, file.name);
        let fileExt = path.extname(sourceFile);
        if (!file.isDirectory() && fileExt === '.css') {
            const input = stream.createReadStream(sourceFile, 'utf-8');
            input.on('data', chunk => output.write(chunk))
        }
    }
}

async function copyDir(sourceDir) {
    const sourcePath = path.join(__dirname, sourceDir);
    const destPath = path.join(buildPath, sourceDir);
    try {
        await fs.promises.mkdir(destPath, {recursive: true});
        const files = await fs.promises.readdir(sourcePath, {
            withFileTypes: true
        });
        for (const file of files) {
            if (!file.isDirectory()) {
                let sourceFile = path.join(sourcePath, file.name);
                let destFile = path.join(destPath, file.name);
                await fs.promises.copyFile(sourceFile, destFile)
            } else {
                let source = path.join(sourceDir, file.name);
                copyDir(source).then(()=>console.log("Part files was copied"));
            }
        }
    } catch (err) {
        console.log(err.message)
    }
}

createHtmlBundle().then(()=>console.log("All done!"));