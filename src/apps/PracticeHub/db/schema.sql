-- collection_items Table
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  platform TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  practice_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_practiced TIMESTAMP WITH TIME ZONE
);

-- practice_logs Table
CREATE TABLE IF NOT EXISTS practice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collection_items(id) ON DELETE CASCADE,
  practiced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note TEXT
);

-- tags Table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT DEFAULT 'custom',
  UNIQUE(user_id, name)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_collection_items_user_id ON collection_items(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_status ON collection_items(status);
CREATE INDEX IF NOT EXISTS idx_practice_logs_collection_id ON practice_logs(collection_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
