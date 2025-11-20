export const userConfig = {
  // User Profile
  profile: {
    name: 'Jalen Huang',
    initials: 'J.', // Used for the Menu Bar logo
    title: 'Full Stack Developer',
    email: 'jalen@example.com',
    location: 'San Francisco, CA',
  },

  // Social Links
  social: {
    github: 'https://github.com/goldfishinsky',
    linkedin: 'https://linkedin.com/in/jalenhuang',
    twitter: 'https://twitter.com/jalenhuang',
  },

  // System Configuration
  system: {
    defaultWallpaper: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80',
    resumeFilename: 'resume.pdf', // Expected in the public folder
  },

  // App Configuration
  apps: {
    // Visibility controls
    showMail: false,
    showVSCode: false,
    showLaunchpad: true,
  },
};

export type UserConfig = typeof userConfig;
