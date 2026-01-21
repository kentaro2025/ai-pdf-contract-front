-- Create payment_methods table to store user's saved payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'paypal', 'btc', 'eth', 'sol')),
  provider TEXT NOT NULL, -- 'stripe', 'paypal', etc.
  provider_payment_method_id TEXT NOT NULL, -- External payment method ID
  is_default BOOLEAN DEFAULT false,
  -- Card-specific fields
  card_brand TEXT, -- 'visa', 'mastercard', 'amex', etc.
  card_last4 TEXT, -- Last 4 digits
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  -- PayPal-specific fields
  paypal_email TEXT,
  -- Crypto-specific fields
  crypto_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional payment method metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default) WHERE is_default = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(user_id) WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own payment methods
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Create policy: Users can insert their own payment methods
CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own payment methods
CREATE POLICY "Users can update their own payment methods"
  ON payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    -- Unset other default payment methods for this user
    UPDATE payment_methods
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND deleted_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one default payment method
CREATE TRIGGER ensure_single_default_payment_method_trigger
  BEFORE INSERT OR UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_methods_updated_at();
