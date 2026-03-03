import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useOrder } from "@/hooks/use-orders";
import { useDeliveryLocation } from "@/hooks/use-delivery";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { MapPin, PackageCheck, Truck, CheckCircle2, Navigation } from "lucide-react";
import { format } from "date-fns";

export default function OrderTracking() {
  const { id } = useParams();
  const orderId = parseInt(id || "0");
  const { data: order, isLoading } = useOrder(orderId);
  const { data: location } = useDeliveryLocation(orderId);

  if (isLoading) return <Layout><div className="p-8" dir="rtl">جاري التحميل...</div></Layout>;
  if (!order) return <Layout><div className="p-8" dir="rtl">الطلب غير موجود</div></Layout>;

  const steps = ["pending", "accepted", "picking_up", "delivering", "completed"];
  const stepLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    accepted: "تم القبول",
    picking_up: "جاري الاستلام",
    delivering: "جاري التوصيل",
    completed: "تم التوصيل"
  };
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <Layout>
        <div className="max-w-3xl mx-auto animate-fade-in-up" dir="rtl">
          <div className="flex items-center justify-between mb-8">
            <div className="text-right">
              <h1 className="text-3xl font-display font-bold">طلب #{order.id}</h1>
              <p className="text-muted-foreground">{order.createdAt ? format(new Date(order.createdAt), "PPP p") : ""}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <Card className="mb-8 overflow-hidden shadow-md">
            <CardContent className="p-8">
              <div className="relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }} 
                />
                
                <div className="relative flex justify-between">
                  {steps.map((step, idx) => {
                    const isActive = idx <= currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-card border-2 text-muted-foreground'}`}>
                          {idx === 0 && <PackageCheck className="w-5 h-5" />}
                          {idx === 1 && <CheckCircle2 className="w-5 h-5" />}
                          {idx === 2 && <MapPin className="w-5 h-5" />}
                          {idx === 3 && <Truck className="w-5 h-5" />}
                          {idx === 4 && <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {stepLabels[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-right">
                <h3 className="font-bold mb-4 border-b pb-2">تفاصيل الطلب</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">العنوان:</span> {order.deliveryAddress}</p>
                  <p><span className="text-muted-foreground">الإجمالي:</span> <span className="font-bold text-primary">${parseFloat(order.totalAmount as string).toFixed(2)}</span></p>
                  <p><span className="text-muted-foreground">الدفع:</span> الدفع عند الاستلام</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                {location ? (
                  <>
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 relative">
                      <Navigation className="w-8 h-8" />
                      <span className="absolute top-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                    </div>
                    <h3 className="font-bold">السائق في الطريق</h3>
                    <p className="text-sm text-muted-foreground mt-1">خط العرض: {location.latitude.toFixed(4)}, خط الطول: {location.longitude.toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground mt-2">تم التحديث: {format(new Date(location.updatedAt!), "p")}</p>
                  </>
                ) : (
                  <>
                    <MapPin className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
                    <p className="text-muted-foreground text-sm">سيظهر التتبع المباشر هنا بمجرد استلام السائق لطلبك.</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
