const fs = require('fs/promises');
const path = require('path');
const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');


const copyDir = async (source, destination) => {
  try {
    await fs.rm(destination, { recursive: true, force: true });
    await fs.mkdir(destination, { recursive: true });
    const files = await fs.readdir(source);

    for (let file of files) {
      const sourceFile = path.join(source, file);
      const destinationFile = path.join(destination, file);
      await fs.copyFile(sourceFile, destinationFile);
    }
  } catch (err) {
    console.log(err.message);
  }
};

copyDir(source, destination)

module.exports = {copyDir}
