import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useCart } from "@/lib/cart-context";
import { useCreateOrder } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag, Loader2 } from "lucide-react";

export default function Checkout() {
  const { items, total, removeFromCart, clearCart, storeId } = useCart();
  const { user } = useAuth();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const [address, setAddress] = useState("");
  const [, setLocation] = useLocation();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !storeId) return;

    try {
      const order = await createOrder({
        customerId: user.id,
        storeId,
        totalAmount: total.toString(),
        deliveryAddress: address,
        status: "pending"
      });
      clearCart();
      setLocation(`/customer/orders/${order.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  if (items.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["customer"]}>
        <Layout>
          <div className="flex flex-col items-center justify-center py-20" dir="rtl">
            <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
            <h2 className="text-2xl font-bold mb-2">سلة التسوق فارغة</h2>
            <Button asChild variant="outline" className="mt-4"><a href="/customer">تصفح المتاجر</a></Button>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <Layout>
        <div dir="rtl">
          <h1 className="text-3xl font-display font-bold mb-8">إتمام الطلب</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg mb-4 border-b pb-2 text-right">عناصر الطلب</h2>
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div className="text-right">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">الكمية: {item.quantity} × ${parseFloat(item.price as string).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">${(parseFloat(item.price as string) * item.quantity).toFixed(2)}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg mb-4 border-b pb-2 text-right">تفاصيل التوصيل</h2>
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 text-right">
                    <div>
                      <label className="text-sm font-medium mb-1 block">العنوان الكامل</label>
                      <Input 
                        required 
                        placeholder="العنوان، المدينة، الرمز البريدي" 
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="text-right"
                      />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border/50">
                      طريقة الدفع: <strong>الدفع عند الاستلام (COD)</strong>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl shadow-black/5 border-primary/20">
                <CardContent className="p-6 text-right">
                  <h2 className="font-bold text-xl mb-6">الملخص</h2>
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span>${total.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">التوصيل</span><span>$5.00</span></div>
                    <div className="pt-3 border-t flex justify-between text-lg font-bold">
                      <span>الإجمالي</span>
                      <span className="text-primary">${(total + 5).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button type="submit" form="checkout-form" className="w-full h-12 text-lg hover-elevate active-scale shadow-lg shadow-primary/25" disabled={isPending}>
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
                    تأكيد الطلب
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
