import { useState, useCallback } from 'react';
import { defaultCommands } from '../config/commands';
import { defaultFileSystem } from '../config/filesystem';

export const useTerminal = (initialCommands = defaultCommands, initialFileSystem = defaultFileSystem) => {
  const [history, setHistory] = useState([]);
  const [currentDir, setCurrentDir] = useState('/home/user');
  const [fileSystem, setFileSystem] = useState(initialFileSystem);

  const executeCommand = useCallback((input) => {
    const [cmd, ...args] = input.trim().split(' ');
    
    const addToHistory = (entry) => {
      setHistory(prev => [...prev, { type: 'input', text: input }, entry]);
    };

    if (!cmd) return;

    if (!(cmd in initialCommands)) {
      addToHistory({ type: 'error', text: `Command not found: ${cmd}` });
      return;
    }

    try {
      const state = { currentDir, fileSystem };
      const result = initialCommands[cmd].execute(state, args, initialCommands);

      if (result === null) return;

      if (typeof result === 'object') {
        if (result.clear) {
          setHistory([]);
          return;
        }
        if (result.currentDir) {
          setCurrentDir(result.currentDir);
          if (result.message) {
            addToHistory({ type: 'output', text: result.message });
          }
          return;
        }
      }

      if (result !== undefined) {
        addToHistory({ type: 'output', text: result });
      }
    } catch (error) {
      addToHistory({ type: 'error', text: error.message });
    }
  }, [currentDir, fileSystem, initialCommands]);

  return {
    history,
    currentDir,
    fileSystem,
    executeCommand,
    setFileSystem,
  };
};