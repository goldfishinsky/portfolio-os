import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, MapPin, ChevronDown, Code, Server, Database } from 'lucide-react';

import { userConfig } from '../config/userConfig';

export const WebResume: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="h-full w-full bg-white overflow-y-auto scroll-smooth font-sans text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight">{userConfig.profile.initials}</div>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          {['Home', 'Experience', 'Skills', 'Contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className={`hover:text-black transition-colors ${activeSection === item.toLowerCase() ? 'text-black' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {userConfig.profile.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            {userConfig.profile.title}
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => scrollTo('contact')} className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105">
              Get in Touch
            </button>
            <button onClick={() => scrollTo('experience')} className="px-8 py-3 bg-white border border-gray-200 text-black rounded-full font-medium hover:bg-gray-50 transition-all">
              View Work
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 animate-bounce"
        >
          <ChevronDown className="text-gray-400" />
        </motion.div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center">Work Experience</h2>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          
          {/* Meton AI */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white">
              <Code size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl">Meton AI</h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Feb 2025 - Present</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">Full Stack Developer</div>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>Built <strong>UnlockLand</strong>, a cross-platform property app using React Native & Django.</li>
                <li>Engineered map-centric UI with virtualization & Zustand for performance.</li>
                <li>Designed <strong>LangGraph</strong> pipeline for automated land intelligence.</li>
              </ul>
            </div>
          </div>

          {/* Tencent */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-purple-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white">
              <Server size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl">Tencent</h3>
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Jul 2020 - Dec 2022</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">Software Engineer</div>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>Shipped collaboration features for <strong>200M+ users</strong> using React.</li>
                <li>Led cloud migration (VM → Cloud), improving deployment efficiency by 80%.</li>
                <li>Built Pipeline Management System with React Native & Node.js.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Tech Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Code size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'React Native', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Vite'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{skill}</span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                <Server size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'Python (Django)', 'Go', 'REST APIs', 'GraphQL'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{skill}</span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                <Database size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3">DevOps & AI</h3>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Kubernetes', 'GitHub Actions', 'LangGraph', 'MySQL', 'MongoDB'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href={`mailto:${userConfig.profile.email}`} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm">
            <Mail size={20} />
            <span>{userConfig.profile.email}</span>
          </a>
          <a href={userConfig.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-700 hover:text-blue-700 transition-colors shadow-sm">
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </a>
          <div className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-500 cursor-default shadow-sm">
            <MapPin size={20} />
            <span>{userConfig.profile.location}</span>
          </div>
        </div>

        <footer className="mt-20 text-sm text-gray-400">
          © {new Date().getFullYear()} {userConfig.profile.name}. All rights reserved.
        </footer>
      </section>
    </div>
  );
};
