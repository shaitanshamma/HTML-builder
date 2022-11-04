const fs = require('fs/promises');
const path = require('path')
const stat = require("fs");

async function read(current) {
    let currentPath = path.join(__dirname, current);
    try {
        const files = await fs.readdir(currentPath, {
            withFileTypes: true
        });
        for (const file of files) {
            if (!file.isDirectory()) {
                const fileStats = path.join(currentPath, file.name);
                stat.stat(fileStats, (err, stats) => {
                    let sizeInKb = Math.ceil(stats.size/1024);
                    let fileName = path.basename(fileStats,path.extname(fileStats));
                    let fileExt = path.extname(fileStats).split('.')[1];
                    let fullFileProp = `${fileName}-${fileExt}-${sizeInKb}kb`;
                    console.log(fullFileProp)
                })
            }
        }
    } catch (err) {
        console.error(err);
    }
}

read('secret-folder').then(()=>console.log('All done!'));