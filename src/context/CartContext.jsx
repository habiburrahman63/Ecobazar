import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  fetchCart,
  addToCartApi,
  updateCartQuantityApi,
  removeCartItemApi,
  clearCartApi,
} from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id || "guest";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState([]);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (!userId || userId === "guest") {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchCart(userId);
      setItems(data);
    } catch (err) {
      console.error("Cart loading error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const setPending = (productId, isPending) => {
    setPendingIds((prev) =>
      isPending ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      setPending(product._id, true);
      setError("");
      try {
        if (!user) {
          // Guest cart fallback in memory
          setItems((prev) => {
            const existing = prev.find((i) => i.productId === product._id);
            if (existing) {
              return prev.map((i) =>
                i.productId === product._id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + quantity, product.stock),
                      totalPrice:
                        Math.min(i.quantity + quantity, product.stock) *
                        (product.salePrice || product.price),
                    }
                  : i
              );
            }
            return [
              ...prev,
              {
                _id: `guest_${Date.now()}_${Math.random()}`,
                productId: product._id,
                title: product.title,
                price: product.salePrice || product.price,
                stock: product.stock,
                quantity: quantity,
                totalPrice: (product.salePrice || product.price) * quantity,
                image: product.images?.[0]?.url || "",
              },
            ];
          });
          return;
        }

        const updated = await addToCartApi(userId, product, quantity);
        setItems(updated);
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setPending(product._id, false);
      }
    },
    [user, userId]
  );

  const incrementQuantity = useCallback(
    async (itemId) => {
      setPending(itemId, true);
      setError("");
      try {
        if (!user) {
          setItems((prev) =>
            prev.map((i) =>
              i._id === itemId || i.productId === itemId
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + 1, i.stock),
                    totalPrice: Math.min(i.quantity + 1, i.stock) * i.price,
                  }
                : i
            )
          );
          return;
        }

        const updated = await updateCartQuantityApi(userId, itemId, "increment");
        setItems(updated);
      } catch (err) {
        setError(err.message);
      } finally {
        setPending(itemId, false);
      }
    },
    [user, userId]
  );

  const decrementQuantity = useCallback(
    async (itemId) => {
      setPending(itemId, true);
      setError("");
      try {
        if (!user) {
          setItems((prev) =>
            prev
              .map((i) => {
                if (i._id === itemId || i.productId === itemId) {
                  const newQty = i.quantity - 1;
                  return newQty > 0
                    ? { ...i, quantity: newQty, totalPrice: newQty * i.price }
                    : null;
                }
                return i;
              })
              .filter(Boolean)
          );
          return;
        }

        const updated = await updateCartQuantityApi(userId, itemId, "decrement");
        setItems(updated);
      } catch (err) {
        setError(err.message);
      } finally {
        setPending(itemId, false);
      }
    },
    [user, userId]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      setPending(itemId, true);
      try {
        if (!user) {
          setItems((prev) =>
            prev.filter((i) => i._id !== itemId && i.productId !== itemId)
          );
          return;
        }

        const updated = await removeCartItemApi(userId, itemId);
        setItems(updated);
      } catch (err) {
        setError(err.message);
      } finally {
        setPending(itemId, false);
      }
    },
    [user, userId]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user) {
      await clearCartApi(userId);
    }
  }, [user, userId]);

  const isPending = useCallback(
    (productId) => pendingIds.includes(productId),
    [pendingIds]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1),
        0
      ),
    [items]
  );

  const totalItems = useMemo(
    () =>
      items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0),
    [items]
  );

  const contextValue = useMemo(
    () => ({
      items,
      loading,
      error,
      subtotal,
      totalItems,
      addToCart,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
      isPending,
      refreshCart: loadCart,
    }),
    [
      items,
      loading,
      error,
      subtotal,
      totalItems,
      addToCart,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
      isPending,
      loadCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}