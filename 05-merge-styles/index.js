
const fs = require('fs');
const path = require('path');
const source = path.join(__dirname, 'styles');
const destination = path.join(__dirname,'project-dist' )



const mergeStyles = () => {
    try {
        fs.promises.readdir(source, {withFileTypes: true}).then(files => {
            const writableStream = fs.createWriteStream(path.join(destination, 'bundle.css'));
            files.forEach(file => {
              const filePath = path.join(source, file.name);
              const name = path.basename(filePath);
              const extension = path.extname(filePath);
          
              if (extension == '.css') {
                const readableStream = fs.createReadStream(path.join(source, name));
                readableStream.on('data', data => {
                  writableStream.write(data + '\n');
                });
              }
            });
          });
    } catch (e) {
        console.log(e.message);
    }
}

mergeStyles()
