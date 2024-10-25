export const defaultCommands = {
  pwd: {
    description: 'Print working directory',
    execute: (state) => state.currentDir,
  },
  ls: {
    description: 'List directory contents',
    execute: (state) => {
      return state.fileSystem[state.currentDir]?.join('  ') || '';
    },
  },
  cd: {
    description: 'Change directory',
    execute: (state, args) => {
      const resolvePath = (current, target) => {
        if (!target || target === '~') return '/home/user';
        if (target.startsWith('/')) return target;
        
        const parts = current.split('/').filter(Boolean);
        const targetParts = target.split('/').filter(Boolean);
        
        targetParts.forEach(part => {
          if (part === '..') {
            parts.pop();
          } else if (part !== '.') {
            parts.push(part);
          }
        });
        
        return '/' + parts.join('/');
      };

      const newPath = resolvePath(state.currentDir, args[0]);
      
      if (state.fileSystem[newPath]) {
        return { currentDir: newPath };
      }
      throw new Error(`cd: no such directory: ${args[0]}`);
    },
  },
  echo: {
    description: 'Print text to terminal',
    execute: (_, args) => args.join(' '),
  },
  clear: {
    description: 'Clear terminal screen',
    execute: () => ({ clear: true }),
  },
  help: {
    description: 'Show available commands',
    execute: (_, __, commands) => {
      return Object.entries(commands)
        .map(([cmd, info]) => `${cmd}: ${info.description}`)
        .join('\n');
    },
  },
};