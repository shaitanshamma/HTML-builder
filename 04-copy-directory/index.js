const path = require('path');
const fs = require('fs/promises');

async function copyDir(sourceDir) {
    const sourcePath = path.join(__dirname, sourceDir);
    const destName = sourceDir + '-copy';
    const destPath = path.join(__dirname, destName);

    try {
        await fs.mkdir(destPath, {recursive: true});
        const files = await fs.readdir(sourcePath, {
            withFileTypes: true
        });
        for (const file of files) {
            if (!file.isDirectory()) {
                let sourceFile = path.join(sourcePath, file.name);
                let destFile = path.join(destPath, file.name);
                await fs.copyFile(sourceFile,destFile)
            }
        }
    } catch (err) {
        console.log(err.message)
    }
}

copyDir('files').then(() => console.log('All done!'))