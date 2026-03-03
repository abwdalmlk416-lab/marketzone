import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useUpdateLocation } from "@/hooks/use-delivery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Navigation, MapPin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DriverDashboard() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders({ role: "driver" });
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: updateLocation } = useUpdateLocation();
  const { toast } = useToast();

  if (isLoading) return <Layout><div className="p-8" dir="rtl">جاري التحميل...</div></Layout>;

  const availableOrders = orders?.filter(o => o.status === "accepted" && !o.driverId) || [];
  const activeOrders = orders?.filter(o => o.driverId === user?.id && ["picking_up", "delivering"].includes(o.status)) || [];

  const handleAcceptOrder = (orderId: number) => {
    updateStatus({ id: orderId, status: "picking_up", driverId: user?.id });
  };

  const handleUpdateStatus = (orderId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "picking_up" ? "delivering" : "completed";
    updateStatus({ id: orderId, status: nextStatus });
  };

  const simulateLiveLocation = (orderId: number) => {
    const lat = 40.7128 + (Math.random() - 0.5) * 0.01;
    const lng = -74.0060 + (Math.random() - 0.5) * 0.01;
    updateLocation({ orderId, driverId: user!.id, latitude: lat, longitude: lng });
    toast({ title: "تم تحديث الموقع", description: `بث الإحداثيات: ${lat.toFixed(4)}, ${lng.toFixed(4)}` });
  };

  return (
    <ProtectedRoute allowedRoles={["driver"]}>
      <Layout>
        <div dir="rtl" className="text-right">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold">مركز السائق</h1>
            <p className="text-muted-foreground">إدارة عمليات التوصيل والربح.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 justify-end">
                المهام النشطة
                <Navigation className="w-5 h-5 text-primary" />
              </h2>
              {activeOrders.length === 0 ? (
                <Card className="bg-muted/20 border-dashed"><CardContent className="p-6 text-center text-muted-foreground text-sm">لا توجد مهام نشطة. اقبل طلباً للبدء.</CardContent></Card>
              ) : (
                activeOrders.map(o => (
                  <Card key={o.id} className="border-primary/30 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-primary" />
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <StatusBadge status={o.status} />
                        <div>
                          <h3 className="font-bold">طلب #{o.id}</h3>
                          <p className="text-sm font-medium mt-1">{o.deliveryAddress} <MapPin className="w-4 h-4 inline ml-1 text-muted-foreground"/></p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-6">
                        {o.status === "delivering" && (
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={() => simulateLiveLocation(o.id)}>
                            <Navigation className="w-4 h-4 ml-2" /> بث GPS
                          </Button>
                        )}
                        <Button className="w-full col-span-2 sm:col-span-1" onClick={() => handleUpdateStatus(o.id, o.status)}>
                          {o.status === "picking_up" ? "تأكيد الاستلام" : <><CheckCircle2 className="w-4 h-4 ml-2"/> إتمام التوصيل</>}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">الطلبات المتاحة</h2>
              {availableOrders.length === 0 ? (
                <Card className="bg-muted/20 border-dashed"><CardContent className="p-6 text-center text-muted-foreground text-sm">لا توجد طلبات متاحة حالياً.</CardContent></Card>
              ) : (
                <div className="space-y-3">
                  {availableOrders.map(o => (
                    <Card key={o.id} className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-sm text-primary">${(parseFloat(o.totalAmount as string) * 0.15).toFixed(2)} <span className="text-xs text-muted-foreground font-normal">تقديري</span></p>
                          <Button size="sm" onClick={() => handleAcceptOrder(o.id)}>قبول</Button>
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-1">طلب #{o.id}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{o.deliveryAddress}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
