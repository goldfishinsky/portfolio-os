import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export const Resume: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-100 overflow-auto p-8 flex justify-center">
      <div className="bg-white shadow-lg w-full max-w-[800px] min-h-[1000px] p-12 flex flex-col gap-6 text-gray-800">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-6 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">Junrong Huang</h1>
          
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1"><MapPin size={14}/> Vancouver, BC, Canada</div>
            <div className="flex items-center gap-1"><Mail size={14}/> yipian01@gmail.com</div>
            <div className="flex items-center gap-1"><Phone size={14}/> 236-869-9338</div>
            <div className="flex items-center gap-1"><Linkedin size={14}/> linkedin.com/in/junronghuang</div>
          </div>
        </div>

        {/* Summary */}
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Summary</h3>
          <p className="text-sm leading-relaxed text-gray-700">
            Full-stack Software Engineer (3+ years) shipping web, mobile, and cloud apps. Strengths in React/React Native (TypeScript), Next.js, Node.js, Python (Django), and DevOps. Proven impact at massive scale (200M+ MAU) and in 0→1 product delivery with reliable CI/CD.
          </p>
        </section>

        {/* Technologies */}
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Technologies</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-bold">Front-end:</span> React, React Native (Expo), Next.js, TypeScript, Zustand, Vite/Webpack, HTML/CSS</div>
            <div><span className="font-bold">Back-end:</span> Node.js (Koa), Python (Django), REST APIs, MySQL, MongoDB, SQLite, SQL</div>
            <div><span className="font-bold">AI/LLM:</span> LangGraph, n8n</div>
            <div><span className="font-bold">DevOps:</span> Docker, Kubernetes, GitHub Actions, IaC, CI/CD</div>
            <div><span className="font-bold">Languages:</span> JavaScript/TypeScript, Python, Go, SQL</div>
          </div>
        </section>

        {/* Work Experience */}
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 pb-1">Work Experience</h3>
          
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-md">Meton AI, Full Stack Developer</h4>
              <span className="text-sm text-gray-500">Feb 2025 - present</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
              <li>Built and shipped UnlockLand, a <strong>cross-platform property plot-assessment app</strong> (iOS/Android/Web) using <strong>React + React Native (TypeScript)</strong>, <strong>Vite</strong>, <strong>Python</strong> (Django).</li>
              <li>Built official website with <strong>Next.js</strong>; established routing & component architecture, baseline <strong>SEO</strong>, <strong>SSR</strong>/ISR, and automated build/deploy via <strong>GitHub Actions</strong>.</li>
              <li>Engineered a tile-layer, map-centric UI with multi-parcel selection and two-way list↔map sync; improved responsiveness via virtualization, batched updates, memoized selectors (<strong>Zustand</strong>).</li>
              <li>Designed a <strong>LangGraph</strong>-powered land intelligence pipeline that automatically aggregates nearby property transaction prices and relevant government documents, then combines zoning type to generate redevelopment plans (e.g., feasibility options and constraints).</li>
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-md">Tencent, Software Engineer</h4>
              <span className="text-sm text-gray-500">July 2020 - Dec 2022</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
              <li>Shipped collaboration features (e.g., Collaborative Folders, Document Modes) with <strong>React (TypeScript)</strong> for a platform serving 200M+ monthly active users.</li>
              <li>Led cloud migration of deployment pipelines (VM → cloud) using IaC and progressive delivery; designed the CI pipeline with automated tests & pre-deploy checks, yielding 98% fewer deployment errors and 80% faster deployment efficiency.</li>
              <li>Designed Dockerized worker services with Koa (Node.js) for domain whitelisting and server-side rendering, improving isolation and rollout flexibility.</li>
              <li>Built a Pipeline Management System (React Native + Node.js) to visualize pipeline execution in real time and enhance monitoring.</li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h3>
          <div className="mb-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-md">Fairleigh Dickinson University (Vancouver Campus)</h4>
              <span className="text-sm text-gray-500">Aug 2023 - Dec 2024</span>
            </div>
            <div className="text-sm text-gray-700">Master of Applied Computer Science (Advanced Programming)</div>
          </div>
          <div>
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-md">Central South University</h4>
              <span className="text-sm text-gray-500">Sep 2013 - June 2020</span>
            </div>
            <div className="text-sm text-gray-700">Bachelor & Master in Geological engineering</div>
          </div>
        </section>
      </div>
    </div>
  );
};
