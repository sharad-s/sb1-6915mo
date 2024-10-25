import { useState, useEffect, useRef } from 'react';
import { useTerminal } from '../hooks/useTerminal';

const Terminal = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  
  const {
    history,
    currentDir,
    executeCommand
  } = useTerminal();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        setCommandHistory(prev => [...prev, currentInput]);
        setHistoryIndex(-1);
        executeCommand(currentInput);
        setCurrentInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history]);

  return (
    <div className="bg-black text-green-500 p-4 font-mono h-screen overflow-hidden">
      <div 
        ref={terminalRef}
        className="h-full overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.type === 'input' ? (
              <div>
                <span className="text-blue-400">user@terminal</span>
                <span className="text-gray-400">:</span>
                <span className="text-purple-400">{currentDir}</span>
                <span className="text-gray-400">$ </span>
                {entry.text}
              </div>
            ) : (
              <div className={`whitespace-pre-wrap ${entry.type === 'error' ? 'text-red-500' : ''}`}>
                {entry.text}
              </div>
            )}
          </div>
        ))}
        <div className="flex">
          <span className="text-blue-400">user@terminal</span>
          <span className="text-gray-400">:</span>
          <span className="text-purple-400">{currentDir}</span>
          <span className="text-gray-400">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none ml-1"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;