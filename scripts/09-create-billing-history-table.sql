-- Create billing_history table to store payment transactions
CREATE TABLE IF NOT EXISTS billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'paypal', 'btc', 'eth', 'sol')),
  payment_provider TEXT, -- 'stripe', 'paypal', etc.
  payment_intent_id TEXT, -- Stripe Payment Intent ID or PayPal Order ID
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  invoice_url TEXT, -- URL to download invoice
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional payment metadata
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_subscription_id ON billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_status ON billing_history(status);
CREATE INDEX IF NOT EXISTS idx_billing_history_created_at ON billing_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_billing_history_payment_intent_id ON billing_history(payment_intent_id);

-- Enable Row Level Security
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own billing history
CREATE POLICY "Users can view their own billing history"
  ON billing_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own billing history
CREATE POLICY "Users can insert their own billing history"
  ON billing_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_billing_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_billing_history_updated_at
  BEFORE UPDATE ON billing_history
  FOR EACH ROW
  EXECUTE FUNCTION update_billing_history_updated_at();
