import { SupabaseClient } from "@supabase/supabase-js"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price_monthly: number
  price_yearly: number
  max_documents: number | null
  max_questions_per_month: number | null
  max_storage_bytes: number | null
  features: string[]
  is_active: boolean
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  billing_period: "monthly" | "yearly"
  status: "active" | "cancelled" | "expired" | "past_due"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  cancelled_at: string | null
  plan?: SubscriptionPlan
}

export interface BillingHistoryItem {
  id: string
  user_id: string
  subscription_id: string | null
  plan_id: string
  amount: number
  currency: string
  billing_period: "monthly" | "yearly"
  payment_method: "card" | "paypal" | "btc" | "eth" | "sol"
  payment_provider: string | null
  payment_intent_id: string | null
  status: "pending" | "paid" | "failed" | "refunded"
  invoice_url: string | null
  metadata: Record<string, any>
  paid_at: string | null
  created_at: string
  plan?: SubscriptionPlan
}

export interface PaymentMethod {
  id: string
  user_id: string
  type: "card" | "paypal" | "btc" | "eth" | "sol"
  provider: string
  provider_payment_method_id: string
  is_default: boolean
  card_brand: string | null
  card_last4: string | null
  card_exp_month: number | null
  card_exp_year: number | null
  paypal_email: string | null
  crypto_address: string | null
  metadata: Record<string, any>
  created_at: string
}

/**
 * Get user's current subscription with plan details
 */
export async function getUserSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(
      `
      *,
      plan:subscription_plans(*)
    `
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (error || !data) {
    return null
  }

  return {
    ...data,
    plan: data.plan as SubscriptionPlan,
  } as UserSubscription
}

/**
 * Get all active subscription plans
 */
export async function getSubscriptionPlans(
  supabase: SupabaseClient
): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_monthly", { ascending: true })

  if (error || !data) {
    return []
  }

  return data.map((plan) => ({
    ...plan,
    features: Array.isArray(plan.features) ? plan.features : [],
  })) as SubscriptionPlan[]
}

/**
 * Get subscription plan by name
 */
export async function getSubscriptionPlanByName(
  supabase: SupabaseClient,
  planName: string
): Promise<SubscriptionPlan | null> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("name", planName)
    .eq("is_active", true)
    .single()

  if (error || !data) {
    return null
  }

  return {
    ...data,
    features: Array.isArray(data.features) ? data.features : [],
  } as SubscriptionPlan
}

/**
 * Create or update user subscription
 */
export async function createOrUpdateUserSubscription(
  supabase: SupabaseClient,
  userId: string,
  planId: string,
  billingPeriod: "monthly" | "yearly",
  paymentIntentId?: string,
  stripeCustomerId?: string,
  paypalOrderId?: string
): Promise<UserSubscription | null> {
  // Calculate period end date
  const periodStart = new Date()
  const periodEnd = new Date()
  if (billingPeriod === "monthly") {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  }

  // Check if user already has a subscription
  const { data: existing, error: existingError } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  // If error is not "not found" (PGRST116), log it
  if (existingError && existingError.code !== "PGRST116") {
    console.error("Error checking existing subscription:", existingError)
  }

  let subscription: UserSubscription | null = null

  if (existing) {
    // Update existing subscription
    const { data, error } = await supabase
      .from("user_subscriptions")
      .update({
        plan_id: planId,
        billing_period: billingPeriod,
        status: "active",
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        cancelled_at: null,
        stripe_subscription_id: paymentIntentId || existing.stripe_subscription_id,
        stripe_customer_id: stripeCustomerId || existing.stripe_customer_id,
        paypal_subscription_id: paypalOrderId || existing.paypal_subscription_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select(
        `
        *,
        plan:subscription_plans(*)
      `
      )
      .single()

    if (error) {
      console.error("Error updating subscription:", error)
      return null
    }

    if (data) {
      subscription = {
        ...data,
        plan: data.plan as SubscriptionPlan,
      } as UserSubscription
    }
  } else {
    // Create new subscription
    const { data, error } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: userId,
        plan_id: planId,
        billing_period: billingPeriod,
        status: "active",
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        stripe_subscription_id: paymentIntentId,
        stripe_customer_id: stripeCustomerId,
        paypal_subscription_id: paypalOrderId,
      })
      .select(
        `
        *,
        plan:subscription_plans(*)
      `
      )
      .single()

    if (error) {
      console.error("Error creating subscription:", error)
      console.error("Insert data:", {
        user_id: userId,
        plan_id: planId,
        billing_period: billingPeriod,
        status: "active",
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        stripe_subscription_id: paymentIntentId,
        stripe_customer_id: stripeCustomerId,
        paypal_subscription_id: paypalOrderId,
      })
      return null
    }

    if (data) {
      subscription = {
        ...data,
        plan: data.plan as SubscriptionPlan,
      } as UserSubscription
    }
  }

  return subscription
}

/**
 * Get user's billing history
 */
export async function getBillingHistory(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 50
): Promise<BillingHistoryItem[]> {
  const { data, error } = await supabase
    .from("billing_history")
    .select(
      `
      *,
      plan:subscription_plans(*)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data.map((item) => ({
    ...item,
    plan: item.plan as SubscriptionPlan,
  })) as BillingHistoryItem[]
}

/**
 * Create billing history entry
 */
export async function createBillingHistory(
  supabase: SupabaseClient,
  userId: string,
  subscriptionId: string | null,
  planId: string,
  amount: number,
  billingPeriod: "monthly" | "yearly",
  paymentMethod: "card" | "paypal" | "btc" | "eth" | "sol",
  paymentProvider: string,
  paymentIntentId: string,
  status: "pending" | "paid" | "failed" | "refunded" = "paid",
  metadata?: Record<string, any>
): Promise<BillingHistoryItem | null> {
  const insertData = {
    user_id: userId,
    subscription_id: subscriptionId,
    plan_id: planId,
    amount,
    currency: "USD",
    billing_period: billingPeriod,
    payment_method: paymentMethod,
    payment_provider: paymentProvider,
    payment_intent_id: paymentIntentId,
    status,
    paid_at: status === "paid" ? new Date().toISOString() : null,
    metadata: metadata || {},
  }

  console.log("Creating billing history entry with data:", insertData)

  const { data, error } = await supabase
    .from("billing_history")
    .insert(insertData)
    .select(
      `
      *,
      plan:subscription_plans(*)
    `
    )
    .single()

  if (error) {
    console.error("Error creating billing history:", error)
    console.error("Insert data:", insertData)
    return null
  }

  if (!data) {
    console.error("No data returned from billing history insert")
    return null
  }

  return {
    ...data,
    plan: data.plan as SubscriptionPlan,
  } as BillingHistoryItem
}

/**
 * Create or update payment method
 */
export async function createPaymentMethod(
  supabase: SupabaseClient,
  userId: string,
  type: "card" | "paypal" | "btc" | "eth" | "sol",
  provider: string,
  providerPaymentMethodId: string,
  isDefault: boolean = true,
  cardBrand?: string,
  cardLast4?: string,
  cardExpMonth?: number,
  cardExpYear?: number,
  paypalEmail?: string,
  cryptoAddress?: string,
  metadata?: Record<string, any>
): Promise<PaymentMethod | null> {
  // Check if payment method already exists
  const { data: existing } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", userId)
    .eq("provider_payment_method_id", providerPaymentMethodId)
    .is("deleted_at", null)
    .maybeSingle()

  const insertData: any = {
    user_id: userId,
    type,
    provider,
    provider_payment_method_id: providerPaymentMethodId,
    is_default: isDefault,
    metadata: metadata || {},
  }

  if (type === "card") {
    insertData.card_brand = cardBrand
    insertData.card_last4 = cardLast4
    insertData.card_exp_month = cardExpMonth
    insertData.card_exp_year = cardExpYear
  } else if (type === "paypal") {
    insertData.paypal_email = paypalEmail
  } else if (type === "btc" || type === "eth" || type === "sol") {
    insertData.crypto_address = cryptoAddress
  }

  let paymentMethod: PaymentMethod | null = null

  if (existing) {
    // Update existing payment method
    const { data, error } = await supabase
      .from("payment_methods")
      .update({
        ...insertData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating payment method:", error)
      return null
    }

    if (data) {
      paymentMethod = data as PaymentMethod
    }
  } else {
    // Create new payment method
    const { data, error } = await supabase
      .from("payment_methods")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Error creating payment method:", error)
      console.error("Insert data:", insertData)
      return null
    }

    if (data) {
      paymentMethod = data as PaymentMethod
    }
  }

  return paymentMethod
}

/**
 * Get user's payment methods
 */
export async function getPaymentMethods(
  supabase: SupabaseClient,
  userId: string
): Promise<PaymentMethod[]> {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return data as PaymentMethod[]
}

/**
 * Check if user can perform an action based on subscription limits
 */
export interface SubscriptionLimits {
  canUploadDocument: boolean
  canAskQuestion: boolean
  maxDocuments: number | null
  maxQuestionsPerMonth: number | null
  maxStorageBytes: number | null
  documentsUsed: number
  questionsUsedThisMonth: number
  storageUsed: number
}

export async function checkSubscriptionLimits(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionLimits> {
  // Get user's subscription
  const subscription = await getUserSubscription(supabase, userId)

  // If no subscription, assign free plan
  let plan: SubscriptionPlan | null = null
  if (!subscription) {
    plan = await getSubscriptionPlanByName(supabase, "Free")
    if (plan) {
      // Create free subscription for user
      await createOrUpdateUserSubscription(supabase, userId, plan.id, "monthly")
    }
  } else {
    plan = subscription.plan || null
  }

  if (!plan) {
    // Default to free plan limits if no plan found
    return {
      canUploadDocument: false,
      canAskQuestion: false,
      maxDocuments: 0,
      maxQuestionsPerMonth: 0,
      maxStorageBytes: 0,
      documentsUsed: 0,
      questionsUsedThisMonth: 0,
      storageUsed: 0,
    }
  }

  // Get current usage
  const { count: documentsCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get questions this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: questionsCount } = await supabase
    .from("qa_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString())

  // Get total storage
  const { data: documents } = await supabase
    .from("documents")
    .select("file_size")
    .eq("user_id", userId)

  const storageUsed = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0

  const documentsUsed = documentsCount || 0
  const questionsUsedThisMonth = questionsCount || 0

  // Check limits
  const canUploadDocument =
    plan.max_documents === null || documentsUsed < plan.max_documents
  const canAskQuestion =
    plan.max_questions_per_month === null ||
    questionsUsedThisMonth < plan.max_questions_per_month

  return {
    canUploadDocument,
    canAskQuestion,
    maxDocuments: plan.max_documents,
    maxQuestionsPerMonth: plan.max_questions_per_month,
    maxStorageBytes: plan.max_storage_bytes,
    documentsUsed,
    questionsUsedThisMonth,
    storageUsed,
  }
}
