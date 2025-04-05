import React from 'react';

const HistoryEntry = ({ entry }) => {
  return (
    <div className="terminal-history-entry">
      <div className="terminal-command-line">
        <span className="text-blue-400">user@portfolio</span>
        <span className="text-white">:</span>
        <span className="text-purple-400">{entry.path}</span>
        <span className="text-white">$</span>
        <span className="pl-2">{entry.command}</span>
      </div>
      <div className="terminal-output">{entry.output}</div>
    </div>
  );
};

export default HistoryEntry;