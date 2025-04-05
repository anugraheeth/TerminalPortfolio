import React from 'react';

const TerminalPrompt = ({ currentPath, currentCommand, onInputChange, onKeyDown, inputRef }) => {
  return (
    <div className="terminal-prompt">
      <span className="text-blue-400">anugraheethmohanan@portfolio</span>
      <span className="text-white">:</span>
      <span className="text-purple-400">{currentPath}</span>
      <span className="text-white">$</span>
      <input
        ref={inputRef}
        type="text"
        value={currentCommand}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className="terminal-input"
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
};

export default TerminalPrompt;