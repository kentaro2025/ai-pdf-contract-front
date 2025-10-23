-- Create qa_history table to store questions and answers
CREATE TABLE IF NOT EXISTS qa_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_qa_history_user_id ON qa_history(user_id);
CREATE INDEX IF NOT EXISTS idx_qa_history_document_id ON qa_history(document_id);
CREATE INDEX IF NOT EXISTS idx_qa_history_created_at ON qa_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE qa_history ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own Q&A history
CREATE POLICY "Users can view their own qa_history"
  ON qa_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own Q&A history
CREATE POLICY "Users can insert their own qa_history"
  ON qa_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own Q&A history
CREATE POLICY "Users can delete their own qa_history"
  ON qa_history FOR DELETE
  USING (auth.uid() = user_id);
