import React, { useState } from 'react';
import { fileSystem } from '../utils/fileSystem';
import { FileText, ChevronLeft } from 'lucide-react';

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  
  // Helper to get blog posts from FS (assuming structure)
  const blogFolder = fileSystem.children?.['Documents']?.children?.['Blog'];
  const posts = blogFolder?.children ? Object.values(blogFolder.children) : [];

  if (selectedPost) {
    const post = posts.find(p => p.name === selectedPost);
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="h-12 border-b flex items-center px-4">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
          >
            <ChevronLeft size={16} /> Back to Posts
          </button>
        </div>
        <div className="flex-1 overflow-auto p-8 max-w-3xl mx-auto w-full">
          <article className="prose lg:prose-xl">
            {/* Simple Markdown rendering (replace with react-markdown later if needed) */}
            <h1 className="text-3xl font-bold mb-4">{post?.name.replace('.md', '')}</h1>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post?.content}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Latest Posts</h1>
        <div className="grid gap-4">
          {posts.map((post) => (
            <div 
              key={post.name}
              onClick={() => setSelectedPost(post.name)}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.name.replace('.md', '')}</h2>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {post.content?.slice(0, 150)}...
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  Read more →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
