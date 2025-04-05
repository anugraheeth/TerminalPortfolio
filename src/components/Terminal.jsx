import React, { useState, useEffect, useRef, useCallback } from 'react';
import TerminalPrompt from './TerminalPrompt';
import HistoryEntry from './HistoryEntry';
import { fileSystem, resolvePath, normalizePath } from '../utils/fileSystem';
import { processCommand } from '../utils/commandProcessor';
import '../App.css';

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const commandHistoryRef = useRef([]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (event) => {
    setCurrentCommand(event.target.value);
  };

  const handleCommandExecution = useCallback((command) => {
    const output = processCommand(command, currentPath, setCurrentPath);
    return output;
  }, [currentPath]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const commandToProcess = currentCommand.trim();
      const output = handleCommandExecution(commandToProcess);

      if (commandToProcess && commandToProcess !== 'clear') {
        commandHistoryRef.current = [commandToProcess, ...commandHistoryRef.current];
      }
      setHistoryIndex(-1);

      if (commandToProcess !== 'clear') {
        setHistory((prevHistory) => [
          ...prevHistory,
          { id: Date.now(), command: commandToProcess, output: output, path: currentPath },
        ]);
      }

      setCurrentCommand('');

      if (commandToProcess === 'clear') {
        setHistory([]);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistoryRef.current.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistoryRef.current.length - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistoryRef.current[newIndex] || '');
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistoryRef.current[newIndex] || '');
      }
    } else if (event.key === 'Tab') {
      handleTabCompletion(event);
    }
  };

  const handleTabCompletion = (event) => {
    event.preventDefault();
    const input = currentCommand.toLowerCase();
    if (!input) return;

    const parts = input.split(' ');
    const termToComplete = parts.pop() || '';
    const commandPart = parts.join(' ');

    const possibleCommands = ['whoami', 'ls', 'cd', 'cat', 'pwd', 'projects', 'contact', 'about', 'skills', 'neofetch', 'clear', 'help', 'echo'];
    
    // Get the current directory path based on completion context
    const getAbsolutePath = (target) => {
      if (!target) return currentPath;
      if (target.startsWith('/')) return normalizePath(target);
      if (target === '~') return '/home/user';
      return resolvePath(currentPath, target);
    };

    const currentNodePath = getAbsolutePath(termToComplete.includes('/') ? termToComplete.substring(0, termToComplete.lastIndexOf('/')) : '');
    const currentNode = fileSystem[currentNodePath];
    const possibleFiles = currentNode && currentNode.type === 'dir' ? currentNode.content : [];

    // Prioritize command completion if it's the first word
    if (parts.length === 0) {
      const suggestion = possibleCommands.find(cmd => cmd.startsWith(termToComplete));
      if (suggestion) {
        setCurrentCommand(suggestion + ' ');
        return;
      }
    }

    // File/Directory completion
    const matchingFiles = possibleFiles.filter(f => f.toLowerCase().startsWith(termToComplete.split('/').pop() || ''));
    if (matchingFiles.length === 1) {
      const isDir = fileSystem[normalizePath(`${currentNodePath}/${matchingFiles[0]}`)]?.type === 'dir';
      const completedPath = termToComplete.includes('/')
        ? `${termToComplete.substring(0, termToComplete.lastIndexOf('/') + 1)}${matchingFiles[0]}`
        : matchingFiles[0];

      setCurrentCommand(`${commandPart ? commandPart + ' ' : ''}${completedPath}${isDir ? '/' : ' '}`);
    } else if (matchingFiles.length > 1) {
      // If multiple matches, show them like bash
      const output = (
        <div className="flex flex-wrap gap-x-4">
          {matchingFiles.map((item, index) => (
            <span key={index} className={fileSystem[normalizePath(`${currentNodePath}/${item}`)]?.type === 'dir' ? "text-blue-400" : "text-green-400"}>
              {item}
            </span>
          ))}
        </div>
      );
      setHistory((prevHistory) => [
        ...prevHistory,
        { id: Date.now(), command: currentCommand, output: output, path: currentPath },
      ]);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="terminal-container"
      onClick={handleTerminalClick}
    >
      <div className="terminal-welcome">Welcome to My Interactive Portfolio! Type 'help' for available commands.</div>

      {history.map((entry) => (
        <HistoryEntry key={entry.id} entry={entry} />
      ))}

      <TerminalPrompt 
        currentPath={currentPath}
        currentCommand={currentCommand}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
      
      <div ref={terminalEndRef} />
    </div>
  );
};

export default Terminal;