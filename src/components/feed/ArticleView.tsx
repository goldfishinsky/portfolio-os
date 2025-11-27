import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { FeedItem } from '../../store/feedStore';

interface ArticleViewProps {
  article: FeedItem | null;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article }) => {
  if (!article) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-white dark:bg-black text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium">Select an article to read</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-black relative">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
            <span className="text-blue-500">{article.feedTitle}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-black dark:text-white leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>

          <a 
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-full"
          >
            <ExternalLink size={16} />
            Read Original
          </a>
        </header>

        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-500 hover:prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: article.content || article.contentSnippet }} />
        </article>
      </div>
    </div>
  );
};
