const fs = require('fs');
const path = require('path');
const destination = path.join(__dirname, 'project-dist')
const stylesSource = path.join(__dirname, 'styles');
const stylesDestination = path.join(destination);
const assetsSource = path.join(__dirname,'assets');
const assetsDestination = path.join(destination, 'assets')

const clearDir =  async () => {
    try {
        await fs.promises.rm(path.resolve(__dirname, 'project-dist'), { recursive: true, force: true });
    } catch (e) {
        console.log(e.message);
    }
}

const createDir =  async () => {
    try {
        await fs.promises.mkdir(assetsDestination, { recursive: true })

    } catch (e) {
        console.log(e.message);
    }
}

const mergeStyles = (source, destination, filename) => {
    try {
        fs.promises.readdir(source, {withFileTypes: true, flags: 'a'}).then(files => {
            const writableStream = fs.createWriteStream(path.join(destination, filename));
            files.forEach(file => {
              const filePath = path.join(source, file.name);
              const name = path.basename(filePath);
              const extension = path.extname(filePath);
          
              if (file.isFile() && extension == '.css') {
                const readableStream = fs.createReadStream(path.join(source, name));
                readableStream.pipe(writableStream);
              }
            });
          });
    } catch (e) {
        console.log(e.message);
    }
}

const copyDir = async (source, destination) => {
    try {
      await fs.promises.rm(destination, { recursive: true, force: true },() => {});
      await fs.promises.mkdir(destination, { recursive: true });
      const files = await fs.promises.readdir(source);
  
      for (let file of files) {
        const sourceFile = path.join(source, file);
        const destinationFile = path.join(destination, file);
        await fs.promises.copyFile(sourceFile, destinationFile);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  

const copyDirectory = async (assetsSource, assetsDestination) => {
    try {
        const files = await fs.promises.readdir(assetsSource, {withFileTypes: true})
        for (let i = 0; i < files.length; i++) {
            const from = path.join(assetsSource, files[i].name);
            const to = path.join(assetsDestination, files[i].name);
            await fs.promises.rm(to, { recursive: true, force: true });
            await fs.promises.mkdir(path.join(assetsDestination,files[i].name), { recursive: true })
            if (files[i].isDirectory()) {
                await copyDirectory(from, to)
            } else {
                await copyDir(assetsSource, assetsDestination)
            }
        }  
    } catch (e) {
        console.log(e.message);
    }
}
const buildHtmlFromTemplates = async () => {
    try {
        const template = path.join(__dirname, 'template.html');
        let templateRead = await fs.promises.readFile(template, 'utf-8');
        const componentsDir = path.join(__dirname, 'components');
        const components = await fs.promises.readdir(componentsDir);
        for (let file of components) {
            const extension = path.extname(file);
            if (extension == '.html') {
                const componentName = path.parse(path.join(componentsDir, file)).name;
                let componentRead = await fs.promises.readFile(path.join(componentsDir, file));
                templateRead = templateRead.replace(`{{${componentName}}}`, componentRead);
            };
        }
        fs.writeFile(path.join(destination, 'index.html'), templateRead, () => {});
    } catch (e) {
        console.log(e.message);
    }
}


  const main = async () => {
    await clearDir()
    await createDir()
    await copyDirectory(assetsSource, assetsDestination)
    await mergeStyles(stylesSource, stylesDestination, 'style.css')
    await buildHtmlFromTemplates()
    return true
  }

  main()