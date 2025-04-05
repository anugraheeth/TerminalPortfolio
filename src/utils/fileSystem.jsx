// FileSystem utilities
export const fileSystem = {
    '/': { type: 'dir', content: ['home'] },
    '/home': { type: 'dir', content: ['anugraheeth'] },
    '/home/anugraheeth': { type: 'dir', content: ['projects', 'about.txt', 'contact.txt', 'skills.txt'] },
    '/home/anugraheeth/projects': { type: 'dir', content: ['rbac-dashboard', 'resume-builder','student-report-app','portfolio'] },
    '/home/anugraheeth/projects/rbac-dashboard': {type: 'file', content: 'RBAC Dashboard (Schedulo): A secure, dynamic, and scalable admin dashboard for managing users, roles, and permissions with JWT-based authentication.\nAlso includes a scheduling system for teachers and students, ensuring conflict-free assignments.\nBuilt with React, Redux, Node.js, MongoDB, JWT, Render.'},
    '/home/anugraheeth/projects/resume-builder': {type: 'file',content: 'Resume Builder (Simply Resume): A fully functional static resume builder showcasing front-end skills without a database.\nDesigned with a clean and intuitive template.\nBuilt with HTML, CSS, JavaScript.'},
    '/home/anugraheeth/projects/student-report-app': {type: 'file',content: 'Student Report Management (Grade Master): A secure, user-friendly web app for generating student reports and verifying data.\nDigitized records for the CS department since 2002.\nBuilt with HTML, CSS, JavaScript, PHP, MySQL.'},
    '/home/anugraheeth/projects/portfolio': {type: 'file',content: 'Personal Portfolio (Anugraheeth Mohanan): An interactive personal portfolio website to demonstrate UI/UX and development skills.\nBuilt with HTML, CSS, JavaScript, and deployed on Netlify.'},
    '/home/anugraheeth/about.txt': { type: 'file', content: 'About Me:\n------------\nI am a highly motivated Full-Stack Engineer with a passion for creating intuitive and performant interfaces with a strong focus on React for dynnamic Frontend. \nI have experience in TypeScript, Tailwind CSS, and building responsive web applications.\nAlways eager to learn new technologies.' },
    '/home/anugraheeth/contact.txt': { type: 'file', content: 'Contact Info:\n--------------\nEmail: anugraheethmohan@gmail.com\nLinkedIn: linkedin.com/in/anugraheethmohan\nGitHub: github.com/anugraheeth\nPhone: +91-8078731204' },
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