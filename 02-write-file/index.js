const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;


const filePath = path.join(__dirname, 'text.txt')
const output = fs.createWriteStream(filePath, 'utf-8');

stdout.write('Ожидание ввода...\n("exit" или  Ctrl + C чтобы выйти)\n\n');

stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
        process.exit();
    }
    output.write(data);
});

process.on('exit', () => stdout.write('\nПока!\n'));
process.on('SIGINT', () => process.exit());