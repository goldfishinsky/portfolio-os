import React from 'react';
import { CollectionItem } from '../types';
import CollectionCard from './CollectionCard';

interface CollectionGridProps {
  items: CollectionItem[];
  isLoading?: boolean;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
        <span className="text-6xl mb-6 opacity-50">📭</span>
        <p className="text-lg font-medium">No collections found</p>
        <p className="text-sm opacity-70">Add content or change your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
      {items.map((item) => (
        <CollectionCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CollectionGrid;
