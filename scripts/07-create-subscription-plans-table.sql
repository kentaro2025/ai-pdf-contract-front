-- Create subscription_plans table to store available subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'Free', 'Basic', 'Pro'
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  max_documents INTEGER, -- NULL means unlimited
  max_questions_per_month INTEGER, -- NULL means unlimited
  max_storage_bytes BIGINT, -- NULL means unlimited
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);

-- Enable Row Level Security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can view active plans
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- Insert default plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, max_documents, max_questions_per_month, max_storage_bytes, features) VALUES
('Free', 'Perfect for getting started', 0, 0, 10, 50, 104857600, '["Up to 10 documents", "50 questions per month", "Basic AI responses", "Email support", "Community access"]'::jsonb),
('Basic', 'For individuals and small teams', 9.99, 99.99, 100, 500, 1073741824, '["Up to 100 documents", "500 questions per month", "Advanced AI responses", "Priority email support", "API access", "Custom document processing"]'::jsonb),
('Pro', 'For power users and businesses', 19.99, 199.99, NULL, NULL, NULL, '["Unlimited documents", "Unlimited questions", "Premium AI responses", "24/7 priority support", "Advanced API access", "Custom integrations", "Team collaboration", "Advanced analytics"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_plans_updated_at();
