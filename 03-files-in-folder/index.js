const {readdir,stat} = require('fs/promises');
const fs = require('fs')
const path = require('path');


const readDrectory = async () => {
    try {
        const pathToFolder = path.join(__dirname, 'secret-folder')
        const folderContent = await readdir(pathToFolder)
    
        folderContent.forEach(async content => {
            const pathFile =  path.join(pathToFolder, content)
            const fileState = await stat(pathFile)
            const size = (fileState.size / 1024).toFixed(3)
            if (fileState.isFile()) {
                const extension = path.extname(pathFile)
                console.log(path.basename(pathFile,extension) + '-' + extension.slice(1, extension.length) + '-' + size + 'KB');
            }
        })
    } catch (e) {
        console.log(e.message);
    }

}

readDrectory()
