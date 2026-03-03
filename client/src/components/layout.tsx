import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, Package, Store as StoreIcon, Activity, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { items } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin": return "/admin";
      case "seller": return "/seller";
      case "driver": return "/driver";
      default: return "/customer";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl hidden sm:inline-block">MarketZone</span>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-1">
                <Button variant="ghost" asChild className="hover-elevate">
                  <Link href={getDashboardLink()}>
                    {user.role === "admin" && <Activity className="w-4 h-4 ml-2" />}
                    {user.role === "seller" && <StoreIcon className="w-4 h-4 ml-2" />}
                    {user.role === "driver" && <Truck className="w-4 h-4 ml-2" />}
                    {user.role === "admin" ? "لوحة الإدارة" : "لوحة التحكم"}
                  </Link>
                </Button>
                {user.role === "customer" && (
                  <Button variant="ghost" asChild className="hover-elevate">
                    <Link href="/customer/orders">طلباتي</Link>
                  </Button>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher size="icon" />

            {user?.role === "customer" && (
              <Button variant="outline" size="icon" asChild className="relative hover-elevate">
                <Link href="/checkout">
                  <ShoppingCart className="w-4 h-4" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                      {items.length}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm hidden sm:block text-right">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-muted-foreground text-xs capitalize">
                    {user.role === 'admin' ? 'مدير' : user.role === 'seller' ? 'بائع' : user.role === 'driver' ? 'سائق' : 'عميل'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive active-scale">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">دخول</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover-elevate">
                  <Link href="/register">تسجيل</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in-up">
        {children}
      </main>

      <footer className="border-t py-8 mt-auto bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 MarketZone Enterprise. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

