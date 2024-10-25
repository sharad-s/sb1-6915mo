const readline = require('readline');
const path = require('path');
const fs = require('fs');

let currentDir = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ '
});

const commands = {
  pwd: () => {
    console.log(currentDir);
  },
  ls: () => {
    try {
      const files = fs.readdirSync(currentDir);
      console.log(files.join('  '));
    } catch (err) {
      console.error('Error reading directory:', err.message);
    }
  },
  cd: (args) => {
    if (!args.length) {
      currentDir = process.env.HOME || process.cwd();
      return;
    }
    
    const newPath = path.resolve(currentDir, args[0]);
    try {
      if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
        currentDir = newPath;
      } else {
        console.error('Directory not found');
      }
    } catch (err) {
      console.error('Error changing directory:', err.message);
    }
  },
  echo: (args) => {
    console.log(args.join(' '));
  },
  clear: () => {
    console.clear();
  },
  exit: () => {
    console.log('Goodbye!');
    process.exit(0);
  }
};

console.log('Simple Terminal Simulation (type "exit" to quit)');
rl.prompt();

rl.on('line', (line) => {
  const [cmd, ...args] = line.trim().split(' ');
  
  if (cmd in commands) {
    commands[cmd](args);
  } else if (cmd) {
    console.log(`Command not found: ${cmd}`);
  }
  
  rl.prompt();
}).on('close', () => {
  console.log('\nGoodbye!');
  process.exit(0);
});