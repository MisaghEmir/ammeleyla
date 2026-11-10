
import axios from "axios";

/* =========================================================
   API CONFIG
========================================================= */

export const API_URL =
  // process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  process.env.NEXT_PUBLIC_API_URL || "https://ammeleyla-server.onrender.com/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* =========================================================
   AUTH INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =========================================================
   TYPES
========================================================= */

export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface ProductVariant {
  _id?: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  sku?: string;
  isActive?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: ProductImage[];
  category:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };
  variants?: ProductVariant[];
  stock?: number;
  isActive: boolean;
  isFeatured?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface CartItem {
  _id: string;
  product: Product;
  variant: {
    _id?: string;
    color?: string;
    size?: string;
    sku?: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    isActive?: boolean;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  user?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;

  // برای سازگاری با صفحه فعلی سبد خرید
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;

  updatedAt?: string;
}


export interface WishlistItem {
  _id: string;
  product: Product;
  createdAt: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  variant?: {
    color?: string;
    size?: string;
    sku?: string;
  };
}

export interface ShippingAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   AUTH TYPES
========================================================= */

export interface SendCodeResponse {
  success: boolean;
  message: string;
  developmentCode?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
  accessToken?: string;
  user?: User;
  verificationToken?: string;
}

export interface CompleteProfileResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}

/* =========================================================
   AUTH API
========================================================= */

export const authApi = {
  sendCode: async (phone: string) => {
    const { data } = await api.post<SendCodeResponse>(
      "/auth/send-code",
      { phone },
    );

    return data;
  },

  verifyCode: async (phone: string, code: string) => {
    const { data } = await api.post<VerifyCodeResponse>(
      "/auth/verify-code",
      { phone, code },
    );

    return data;
  },

  completeProfile: async (params: {
    verificationToken: string;
    name: string;
    email?: string;
  }) => {
    const { data } = await api.post<CompleteProfileResponse>(
      "/auth/complete-profile",
      params,
    );

    return data;
  },

  me: async () => {
    const { data } = await api.get<{
      success: boolean;
      user: User;
    }>("/auth/me");

    return data;
  },

  logout: async () => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
    }>("/auth/logout");

    return data;
  },
};

/* =========================================================
   PRODUCTS API
========================================================= */

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "popular";
  featured?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productsApi = {
  getAll: async (params?: ProductQuery) => {
    const { data } = await api.get<ProductsResponse>("/products", {
      params,
    });

    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<{
      success: boolean;
      product: Product;
    }>(`/products/${slug}`);

    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{
      success: boolean;
      product: Product;
    }>(`/products/id/${id}`);

    return data;
  },

  getFeatured: async (limit = 8) => {
    const { data } = await api.get<ProductsResponse>("/products", {
      params: {
        featured: true,
        limit,
      },
    });

    return data;
  },

  getByCategory: async (
    categorySlug: string,
    params?: Omit<ProductQuery, "category">,
  ) => {
    const { data } = await api.get<ProductsResponse>("/products", {
      params: {
        ...params,
        category: categorySlug,
      },
    });

    return data;
  },
};

/* =========================================================
   CATEGORIES API
========================================================= */

export const categoriesApi = {
  getAll: async () => {
    const { data } = await api.get<{
      success: boolean;
      categories: Category[];
    }>("/categories");

    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<{
      success: boolean;
      category: Category;
    }>(`/categories/${slug}`);

    return data;
  },

  getChildren: async (slug: string) => {
    const { data } = await api.get<{
      success: boolean;
      categories: Category[];
    }>(`/categories/${slug}/children`);

    return data;
  },
};


/* =========================================================
   CART API
========================================================= */

export interface AddCartItemRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export const cartApi = {
  get: async () => {
    const { data } = await api.get<{
      success: boolean;
      cart: Cart;
    }>("/cart");

    return {
      ...data,
      cart: normalizeCart(data.cart),
    };
  },

  add: async (params: AddCartItemRequest) => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      cart: Cart;
    }>("/cart/items", params);

    return {
      ...data,
      cart: normalizeCart(data.cart),
    };
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { data } = await api.patch<{
      success: boolean;
      message: string;
      cart: Cart;
    }>(`/cart/items/${itemId}`, { quantity });

    return {
      ...data,
      cart: normalizeCart(data.cart),
    };
  },

  remove: async (itemId: string) => {
    const { data } = await api.delete<{
      success: boolean;
      message: string;
      cart: Cart;
    }>(`/cart/items/${itemId}`);

    return {
      ...data,
      cart: normalizeCart(data.cart),
    };
  },

  clear: async () => {
    const { data } = await api.delete<{
      success: boolean;
      message: string;
      cart: Cart;
    }>("/cart");

    return {
      ...data,
      cart: normalizeCart(data.cart),
    };
  },
};

function normalizeCart(cart: Cart): Cart {
  const items = (cart.items ?? []).map((item) => ({
    ...item,
    price: undefined,
    subtotal:
      item.subtotal ??
      item.variant.price * item.quantity,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  return {
    ...cart,
    items: items.map((item) => ({
      ...item,
      price: item.variant.price,
    })) as CartItem[],
    subtotal,
    discount: cart.discount ?? 0,
    shipping: cart.shipping ?? 0,
    total: cart.total ?? subtotal,
    totalItems: cart.totalItems ?? items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ),
    totalPrice: cart.totalPrice ?? subtotal,
  };
}

/* =========================================================
   WISHLIST API
========================================================= */

export const wishlistApi = {
  get: async () => {
    const { data } = await api.get<{
      success: boolean;
      items: WishlistItem[];
    }>("/wishlist");

    return data;
  },

  add: async (productId: string) => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      items: WishlistItem[];
    }>("/wishlist", {
      productId,
    });

    return data;
  },

  remove: async (productId: string) => {
    const { data } = await api.delete<{
      success: boolean;
      message: string;
      items: WishlistItem[];
    }>(`/wishlist/${productId}`);

    return data;
  },

  check: async (productId: string) => {
    const { data } = await api.get<{
      success: boolean;
      isFavorite: boolean;
    }>(`/wishlist/check/${productId}`);

    return data;
  },
};

/* =========================================================
   ORDERS API
========================================================= */

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: "ONLINE" | "COD";
}

export const ordersApi = {
  create: async (params: CreateOrderRequest) => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      order: Order;
    }>("/orders", params);

    return data;
  },

  getMyOrders: async () => {
    const { data } = await api.get<{
      success: boolean;
      orders: Order[];
    }>("/orders/my");

    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{
      success: boolean;
      order: Order;
    }>(`/orders/${id}`);

    return data;
  },

  cancel: async (id: string) => {
    const { data } = await api.patch<{
      success: boolean;
      message: string;
      order: Order;
    }>(`/orders/${id}/cancel`);

    return data;
  },
};

/* =========================================================
   USER API
========================================================= */

export const userApi = {
  getProfile: async () => {
    const { data } = await api.get<{
      success: boolean;
      user: User;
    }>("/users/me");

    return data;
  },

  updateProfile: async (params: {
    name?: string;
    email?: string;
  }) => {
    const { data } = await api.patch<{
      success: boolean;
      message: string;
      user: User;
    }>("/users/me", params);

    return data;
  },
};

/* =========================================================
   HEALTH API
========================================================= */

export const healthApi = {
  check: async () => {
    const { data } = await api.get<{
      success: boolean;
      message: string;
      timestamp: string;
    }>("/health");

    return data;
  },
};
