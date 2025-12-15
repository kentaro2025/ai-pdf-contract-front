"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  billingPeriod: "monthly" | "yearly"
  description: string
  features: string[]
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to load cart from localStorage", e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      // Check if item already exists, if so replace it
      const existingIndex = prev.findIndex((i) => i.id === item.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = item
        return updated
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }

  const getItemCount = () => {
    return items.length
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

