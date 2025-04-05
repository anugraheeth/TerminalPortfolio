// FileSystem utilities
export const fileSystem = {
    '/': { type: 'dir', content: ['home'] },
    '/home': { type: 'dir', content: ['anugraheeth'] },
    '/home/anugraheeth': { type: 'dir', content: ['projects', 'about.txt', 'contact.txt', 'skills.txt'] },
    '/home/anugraheeth/projects': { type: 'dir', content: ['cool-project', 'another-app'] },
    '/home/anugraheeth/projects/cool-project': { type: 'file', content: 'Cool Project: A description of my really cool project. Built with React, TypeScript, and Tailwind CSS.' },
    '/home/anugraheeth/projects/another-app': { type: 'file', content: 'Another App: An amazing application solving world hunger. Tech: Svelte, Go, Postgres.' },
    '/home/anugraheeth/about.txt': { type: 'file', content: 'About Me:\n------------\nI am a highly motivated React Frontend Engineer with a passion for creating intuitive and performant anugraheeth interfaces. \nI have experience in TypeScript, Tailwind CSS, and building responsive web applications.\nAlways eager to learn new technologies.' },
    '/home/anugraheeth/contact.txt': { type: 'file', content: 'Contact Info:\n--------------\nEmail: anugraheethmohan@gmail.com\nLinkedIn: linkedin.com/in/anugraheethmohan\nGitHub: github.com/anugraheeth' },
    '/home/anugraheeth/skills.txt': { type: 'file', content: 'Skills:\n-------\n- Frontend: React, TypeScript, JavaScript, HTML5, CSS3\n- Styling: Tailwind CSS, CSS Modules, Styled Components\n- State Management: Redux, Zustand\n- Testing: Jest, React Testing Library\n- Tools: Git, Webpack, Vite, Docker\n- UI/UX Design Principles' },
  };
  
  // Function to resolve paths (handles .., ., ~, absolute, relative)
  export const resolvePath = (currentPath, targetPath) => {
    if (targetPath.startsWith('/')) {
      // Absolute path
      return normalizePath(targetPath);
    }
    if (targetPath === '~') {
      return '/home/anugraheeth';
    }
  
    const parts = currentPath.split('/').filter(Boolean);
    const targetParts = targetPath.split('/').filter(Boolean);
  
    for (const part of targetParts) {
      if (part === '..') {
        if (parts.length > 0) {
          parts.pop();
        }
      } else if (part !== '.') {
        parts.push(part);
      }
    }
  
    return normalizePath('/' + parts.join('/'));
  };
  
  // Function to normalize paths
  export const normalizePath = (path) => {
    const parts = path.split('/').filter(Boolean);
    const normalized = '/' + parts.join('/');
    return normalized === '/' && path !== '/' ? '/' : normalized || '/';
  };
  
  // Get absolute path helper
  export const getAbsolutePath = (currentPath, target) => {
    if (!target) return currentPath;
    if (target.startsWith('/')) return normalizePath(target);
    if (target === '~') return '/home/anugraheeth';
    return resolvePath(currentPath, target);
  };