# Personal Web OS Template

A highly customizable, macOS-inspired personal website template built with React, TypeScript, and Tailwind CSS.

## Features

- 🍎 **macOS Experience**: Authentic Menu Bar, Dock, Launchpad, and Window Management.
- 📂 **Finder**: Functional file system navigation.
- 📄 **Resume Viewer**: Built-in PDF viewer for your resume.
- 🌐 **Web Resume**: Interactive browser-based portfolio.
- 🚀 **Configurable**: Easily customize your profile, links, and assets via a single config file.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-web-os.git
cd personal-web-os
npm install
```

### 2. Configure Your Profile

Open `src/config/userConfig.ts` and update your details:

```typescript
export const userConfig = {
  profile: {
    name: 'Your Name',
    initials: 'YN', // Displayed in the Menu Bar logo
    title: 'Software Engineer',
    email: 'you@example.com',
    location: 'City, Country',
  },
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    // ...
  },
  // ...
};
```

### 3. Add Your Resume

1.  Rename your resume PDF to `resume.pdf` (or whatever you set in `userConfig.system.resumeFilename`).
2.  Place it in the `public/` folder, replacing the existing file.

### 4. Run Locally

```bash
npm run dev
```

### 5. Deploy

Deploy easily to Vercel or Netlify.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgoldfishinsky%2Fportfolio-os)

## Customization

- **Wallpaper**: Change `userConfig.system.defaultWallpaper` to any image URL.
- **Apps**: Toggle app visibility in `userConfig.apps`.
- **Icons**: Replace icons in `src/assets/icons/` if desired.

## License

MIT
