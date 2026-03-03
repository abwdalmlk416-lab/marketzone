import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { LanguageProvider } from "@/lib/language-context";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth";
import CustomerStores from "@/pages/customer/stores";
import StoreDetails from "@/pages/customer/store-details";
import Checkout from "@/pages/customer/checkout";
import OrderTracking from "@/pages/customer/order-tracking";
import CustomerOrdersList from "@/pages/customer/orders-list";
import SellerDashboard from "@/pages/seller/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";
import DriverDashboard from "@/pages/driver/dashboard";

function Router() {
  return (
    <Switch>
      {/* Arabic Routes */}
      <Route path="/ar" component={Landing} />
      <Route path="/ar/login" component={AuthPage} />
      <Route path="/ar/register" component={AuthPage} />
      <Route path="/ar/auth" component={AuthPage} />
      <Route path="/ar/stores" component={CustomerStores} />
      <Route path="/ar/stores/:id" component={StoreDetails} />
      <Route path="/ar/checkout" component={Checkout} />
      <Route path="/ar/orders" component={CustomerOrdersList} />
      <Route path="/ar/orders/:id" component={OrderTracking} />
      <Route path="/ar/seller" component={SellerDashboard} />
      <Route path="/ar/admin" component={AdminDashboard} />
      <Route path="/ar/driver" component={DriverDashboard} />
      
      {/* English Routes */}
      <Route path="/en" component={Landing} />
      <Route path="/en/login" component={AuthPage} />
      <Route path="/en/register" component={AuthPage} />
      <Route path="/en/auth" component={AuthPage} />
      <Route path="/en/stores" component={CustomerStores} />
      <Route path="/en/stores/:id" component={StoreDetails} />
      <Route path="/en/checkout" component={Checkout} />
      <Route path="/en/orders" component={CustomerOrdersList} />
      <Route path="/en/orders/:id" component={OrderTracking} />
      <Route path="/en/seller" component={SellerDashboard} />
      <Route path="/en/admin" component={AdminDashboard} />
      <Route path="/en/driver" component={DriverDashboard} />
      
      {/* Default Routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      <Route path="/auth" component={AuthPage} />
      
      <Route path="/customer" component={CustomerStores} />
      <Route path="/stores/:id" component={StoreDetails} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/customer/orders" component={CustomerOrdersList} />
      <Route path="/customer/orders/:id" component={OrderTracking} />
      
      <Route path="/seller" component={SellerDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/driver" component={DriverDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <LanguageProvider>
            <Toaster />
            <Router />
          </LanguageProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

