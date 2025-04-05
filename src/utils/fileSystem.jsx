// FileSystem utilities
export const fileSystem = {
    '/': { type: 'dir', content: ['home'] },
    '/home': { type: 'dir', content: ['user'] },
    '/home/user': { type: 'dir', content: ['projects', 'about.txt', 'contact.txt', 'skills.txt'] },
    '/home/user/projects': { type: 'dir', content: ['cool-project', 'another-app'] },
    '/home/user/projects/cool-project': { type: 'file', content: 'Cool Project: A description of my really cool project. Built with React, TypeScript, and Tailwind CSS.' },
    '/home/user/projects/another-app': { type: 'file', content: 'Another App: An amazing application solving world hunger. Tech: Svelte, Go, Postgres.' },
    '/home/user/about.txt': { type: 'file', content: 'About Me:\n------------\nI am a highly motivated React Frontend Engineer with a passion for creating intuitive and performant user interfaces. I have experience in TypeScript, Tailwind CSS, and building responsive web applications. Always eager to learn new technologies.' },
    '/home/user/contact.txt': { type: 'file', content: 'Contact Info:\n--------------\nEmail: jane.doe@example.com\nLinkedIn: linkedin.com/in/janedoe\nGitHub: github.com/janedoe' },
    '/home/user/skills.txt': { type: 'file', content: 'Skills:\n-------\n- Frontend: React, TypeScript, JavaScript, HTML5, CSS3\n- Styling: Tailwind CSS, CSS Modules, Styled Components\n- State Management: Redux, Zustand\n- Testing: Jest, React Testing Library\n- Tools: Git, Webpack, Vite, Docker\n- UI/UX Design Principles' },
  };
  
  // Function to resolve paths (handles .., ., ~, absolute, relative)
  export const resolvePath = (currentPath, targetPath) => {
    if (targetPath.startsWith('/')) {
      // Absolute path
      return normalizePath(targetPath);
    }
    if (targetPath === '~') {
      return '/home/user';
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
    if (target === '~') return '/home/user';
    return resolvePath(currentPath, target);
  };