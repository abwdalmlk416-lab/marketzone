import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Link } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function CustomerOrdersList() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders({ role: "customer", userId: user?.id.toString() });

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <Layout>
        <div dir="rtl">
          <h1 className="text-3xl font-display font-bold mb-8 text-right">طلباتي</h1>
          {isLoading ? (
            <div className="text-right">جاري التحميل...</div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground mb-4">لم تقم بإجراء أي طلبات بعد.</p>
              <Button asChild><Link href="/customer">ابدأ التسوق</Link></Button>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mr-auto">
              {orders?.map(order => (
                <Card key={order.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg">طلب #{order.id}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{order.createdAt ? format(new Date(order.createdAt), "PPP") : ""}</p>
                    </div>
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                      <p className="font-bold text-lg">${parseFloat(order.totalAmount as string).toFixed(2)}</p>
                      <Button variant="outline" asChild>
                        <Link href={`/customer/orders/${order.id}`}>تتبع</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
