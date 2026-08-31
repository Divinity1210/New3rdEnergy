'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, PowerProduct, PowerPackage } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  installationRequested: boolean;
  installationFeeEstimate: number;
  total: number;
  isCartOpen: boolean;
  addItem: (product: PowerProduct, quantity?: number) => void;
  addPackage: (pkg: PowerPackage) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleInstallation: () => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '3rd_energy_power_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [installationRequested, setInstallationRequested] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, isInitialized]);

  const addItem = (product: PowerProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && !item.isPackage);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: CartItem = {
        id: `item-${product.id}-${Date.now()}`,
        productId: product.id,
        product,
        quantity,
        unitPrice: product.price,
        isPackage: false,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const addPackage = (pkg: PowerPackage) => {
    const packageItem: CartItem = {
      id: `pkg-${pkg.id}-${Date.now()}`,
      productId: pkg.id,
      product: {
        id: pkg.id,
        slug: pkg.slug,
        name: pkg.name,
        category: 'packages',
        tagline: pkg.tagline,
        description: pkg.description,
        shortDescription: pkg.idealFor,
        price: pkg.price,
        currency: pkg.currency,
        image: pkg.image,
        inStock: true,
        specs: {
          continuousPower: `${pkg.ratingKva}kVA Rating`,
          capacity: `${pkg.batteryKwh}kWh Storage`,
          maxSolarInput: `${pkg.solarKwp}kWp Solar Array`,
          warranty: `${pkg.warrantyYears} Years Warranty`,
        },
        features: [
          `Inverter: ${pkg.inverter.name}`,
          `Battery: ${pkg.batteryQuantity}x ${pkg.battery.name}`,
          pkg.solarPanel ? `Solar: ${pkg.solarQuantity}x ${pkg.solarPanel.name}` : 'Battery-Only Backup',
          pkg.includesInstallation ? 'Turnkey Certified Installation Included' : 'Equipment Only',
        ],
        whyThisProduct: pkg.tagline,
        whatItDoes: pkg.description,
        whoItIsFor: pkg.idealFor,
        whatItCanSupport: [`Estimated Backup: ~${pkg.estimatedBackupHours} hours continuous runtime`],
        order: 0,
      },
      quantity: 1,
      unitPrice: pkg.price,
      isPackage: true,
      packageDetails: {
        packageId: pkg.id,
        packageName: pkg.name,
        includesInstallation: pkg.includesInstallation,
      },
    };

    setItems((prev) => [...prev, packageItem]);
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const toggleInstallation = () => {
    setInstallationRequested((prev) => !prev);
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // If a package already includes installation, don't double count
  const hasIncludedInstallation = items.some((item) => item.packageDetails?.includesInstallation);
  const installationFeeEstimate =
    installationRequested && subtotal > 0 && !hasIncludedInstallation
      ? Math.max(120000, Math.round(subtotal * 0.08)) // 8% of equipment value or 120k min
      : 0;

  const total = subtotal + installationFeeEstimate;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        installationRequested,
        installationFeeEstimate,
        total,
        isCartOpen,
        addItem,
        addPackage,
        removeItem,
        updateQuantity,
        toggleInstallation,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
