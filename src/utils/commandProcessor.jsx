import React from 'react';
import { fileSystem, getAbsolutePath, resolvePath, normalizePath } from './fileSystem';
import { asciiPortrait } from './asciiArt';

export const processCommand = (command, currentPath, setCurrentPath) => {
  const [cmd, ...args] = command.trim().split(' ');
  const argString = args.join(' ');

  switch (cmd) {
    case '':
      return ''; // No output for empty command
    case 'help':
      return (
        <div className="text-green-400">
          Available commands:<br />
          <ul className="list-disc list-inside ml-4">
            <li><span className="text-blue-400">whoami</span>      - Display user information</li>
            <li><span className="text-blue-400">ls [path]</span>   - List directory contents</li>
            <li><span className="text-blue-400">cd &lt;dir&gt;</span>      - Change directory</li>
            <li><span className="text-blue-400">cat &lt;file&gt;</span>    - Display file content</li>
            <li><span className="text-blue-400">pwd</span>         - Print working directory</li>
            <li><span className="text-blue-400">projects</span>    - Alias for 'ls projects'</li>
            <li><span className="text-blue-400">contact</span>     - Alias for 'cat contact.txt'</li>
            <li><span className="text-blue-400">about</span>       - Alias for 'cat about.txt'</li>
            <li><span className="text-blue-400">skills</span>      - Alias for 'cat skills.txt'</li>
            <li><span className="text-blue-400">neofetch</span>    - Display system information</li>
            <li><span className="text-blue-400">clear</span>       - Clear the terminal screen</li>
            <li><span className="text-blue-400">help</span>        - Show this help message</li>
            <li><span className="text-blue-400">echo [text]</span> - Print text to terminal</li>
          </ul>
        </div>
      );
    case 'whoami':
      return (
        <div className="ascii-portrait">
          <pre className="text-green-400 whitespace-pre-wrap">{asciiPortrait}</pre>
          <div className="text-green-400 mt-2">user: Frontend Developer & UI/UX Enthusiast</div>
        </div>
      );
    case 'pwd':
      return <span className="text-green-400">{currentPath}</span>;
    case 'neofetch':
      return (
        <pre className="text-green-400 whitespace-pre-wrap">
{`
        .--.         <span class="text-blue-400">user@portfolio</span>
       |o_o |        ------------
       |:_/ |        <span class="text-white">OS</span>: Web Browser (ReactOS)
      //   \\ \\       <span class="text-white">Host</span>: Your Device
     (|     | )      <span class="text-white">Kernel</span>: JavaScript V8/SpiderMonkey/etc.
    /'\\_   _/ \`\\     <span class="text-white">Uptime</span>: (session duration)
    \\___)=(___/     <span class="text-white">Shell</span>: bash (simulated)
                     <span class="text-white">Resolution</span>: ${window.innerWidth}x${window.innerHeight}
                     <span class="text-white">Terminal</span>: ReactTerm
                     <span class="text-white">CPU</span>: Your Brain Power
                     <span class="text-white">GPU</span>: Your Imagination
                     <span class="text-white">Memory</span>: (browser usage)

                     <span class="text-red-500">██</span><span class="text-green-500">██</span><span class="text-yellow-500">██</span><span class="text-blue-500">██</span><span class="text-purple-500">██</span><span class="text-cyan-500">██</span><span class="text-white">██</span><span class="text-gray-500">██</span>
`}
        </pre>
      );
    case 'ls': {
      const targetPath = getAbsolutePath(currentPath, argString);
      const node = fileSystem[targetPath];
      if (node && node.type === 'dir') {
        return (
          <div className="flex flex-wrap gap-x-4">
            {node.content.map((item, index) => {
              const itemPath = normalizePath(`${targetPath}/${item}`);
              const itemNode = fileSystem[itemPath];
              const isDir = itemNode?.type === 'dir';
              return (
                <span key={index} className={isDir ? "text-blue-400" : "text-green-400"}>
                  {item}
                </span>
              );
            })}
          </div>
        );
      } else if (node && node.type === 'file') {
        return <span className="text-red-400">{`ls: cannot access '${argString || '.'}': Not a directory`}</span>
      }
      else {
        return <span className="text-red-400">{`ls: cannot access '${argString || '.'}': No such file or directory`}</span>;
      }
    }
    case 'cd': {
      if (!argString) {
        setCurrentPath('/home/user'); // cd without args goes home
        return '';
      }
      const targetPath = resolvePath(currentPath, argString);
      const node = fileSystem[targetPath];

      if (node && node.type === 'dir') {
        setCurrentPath(targetPath);
        return ''; // No output on successful cd
      } else if (node && node.type === 'file'){
        return <span className="text-red-400">{`bash: cd: ${argString}: Not a directory`}</span>;
      }
      else {
        return <span className="text-red-400">{`bash: cd: ${argString}: No such file or directory`}</span>;
      }
    }
    case 'cat': {
      if (!argString) {
        return <span className="text-red-400">cat: missing operand</span>;
      }
      const targetPath = getAbsolutePath(currentPath, argString);
      const node = fileSystem[targetPath];
      if (node && node.type === 'file') {
        return <pre className="text-green-400 whitespace-pre-wrap">{node.content}</pre>;
      } else if (node && node.type === 'dir'){
        return <span className="text-red-400">{`cat: ${argString}: Is a directory`}</span>;
      }
      else {
        return <span className="text-red-400">{`cat: ${argString}: No such file or directory`}</span>;
      }
    }
    case 'about':
      return processCommand('cat about.txt', currentPath, setCurrentPath);
    case 'contact':
      return processCommand('cat contact.txt', currentPath, setCurrentPath);
    case 'skills':
      return processCommand('cat skills.txt', currentPath, setCurrentPath);
    case 'projects': {
      const projectsPath = resolvePath(currentPath, 'projects');
      if(fileSystem[projectsPath] && fileSystem[projectsPath].type === 'dir') {
        return processCommand('ls projects', currentPath, setCurrentPath);
      } else {
        // Maybe try root projects if not in home/user
        const rootProjectsPath = '/home/user/projects';
        if(fileSystem[rootProjectsPath] && fileSystem[rootProjectsPath].type === 'dir') {
          return processCommand('ls /home/user/projects', currentPath, setCurrentPath);
        } else {
          return <span className="text-red-400">projects: Not found</span>
        }
      }
    }
    case 'clear':
      return ''; // No output, just clears the screen
    case 'echo':
      return <span className="text-green-400">{argString}</span>;
    default:
      return <span className="text-red-400">{`bash: command not found: ${cmd}`}</span>;
  }
};