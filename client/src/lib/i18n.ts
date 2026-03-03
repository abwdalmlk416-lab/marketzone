// Language types
export type Language = 'ar' | 'en';

export interface Translations {
  // Navigation
  home: string;
  stores: string;
  products: string;
  orders: string;
  cart: string;
  login: string;
  register: string;
  logout: string;
  
  // User roles
  admin: string;
  seller: string;
  driver: string;
  customer: string;
  
  // Dashboard
  dashboard: string;
  myStore: string;
  myOrders: string;
  delivery: string;
  settings: string;
  
  // Common
  search: string;
  category: string;
  price: string;
  quantity: string;
  total: string;
  status: string;
  date: string;
  actions: string;
  
  // Status
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;
  
  // Messages
  welcome: string;
  welcomeMessage: string;
  noProducts: string;
  noOrders: string;
  orderPlaced: string;
  orderShipped: string;
  orderDelivered: string;
  
  // SEO
  siteName: string;
  siteDescription: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    // Navigation
    home: "الرئيسية",
    stores: "المتاجر",
    products: "المنتجات",
    orders: "الطلبات",
    cart: "السلة",
    login: "دخول",
    register: "تسجيل",
    logout: "خروج",
    
    // User roles
    admin: "مدير",
    seller: "بائع",
    driver: "سائق",
    customer: "عميل",
    
    // Dashboard
    dashboard: "لوحة التحكم",
    myStore: "متجري",
    myOrders: "طلباتي",
    delivery: "التوصيل",
    settings: "الإعدادات",
    
    // Common
    search: "بحث",
    category: "الفئة",
    price: "السعر",
    quantity: "الكمية",
    total: "المجموع",
    status: "الحالة",
    date: "التاريخ",
    actions: "الإجراءات",
    
    // Status
    pending: "قيد الانتظار",
    processing: "قيد المعالجة",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
    
    // Messages
    welcome: "مرحباً بك",
    welcomeMessage: "أهلاً بك في MarketZone - أكبر منصة تسوق إلكترونية في العراق",
    noProducts: "لا توجد منتجات",
    noOrders: "لا توجد طلبات",
    orderPlaced: "تم تقديم الطلب بنجاح",
    orderShipped: "تم شحن الطلب",
    orderDelivered: "تم توصيل الطلب",
    
    // SEO
    siteName: "ماركت زون",
    siteDescription: "أكبر منصة تسوق إلكترونية في العراق"
  },
  en: {
    // Navigation
    home: "Home",
    stores: "Stores",
    products: "Products",
    orders: "Orders",
    cart: "Cart",
    login: "Login",
    register: "Register",
    logout: "Logout",
    
    // User roles
    admin: "Admin",
    seller: "Seller",
    driver: "Driver",
    customer: "Customer",
    
    // Dashboard
    dashboard: "Dashboard",
    myStore: "My Store",
    myOrders: "My Orders",
    delivery: "Delivery",
    settings: "Settings",
    
    // Common
    search: "Search",
    category: "Category",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    status: "Status",
    date: "Date",
    actions: "Actions",
    
    // Status
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    
    // Messages
    welcome: "Welcome",
    welcomeMessage: "Welcome to MarketZone - Iraq's largest online marketplace",
    noProducts: "No products found",
    noOrders: "No orders found",
    orderPlaced: "Order placed successfully",
    orderShipped: "Order shipped",
    orderDelivered: "Order delivered",
    
    // SEO
    siteName: "MarketZone",
    siteDescription: "Iraq's largest online marketplace"
  }
};

// Helper function to get nested translation
export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

