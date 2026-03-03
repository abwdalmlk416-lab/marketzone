import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { usePlatformAnalytics } from "@/hooks/use-analytics";
import { useStores, useUpdateStoreStatus } from "@/hooks/use-stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Check, X, ShieldAlert, TrendingUp, Users, Building2, Package } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = usePlatformAnalytics();
  const { data: stores } = useStores();
  const { mutate: updateStatus } = useUpdateStoreStatus();

  const pendingStores = stores?.filter(s => s.status === "pending") || [];
  const activeStores = stores?.filter(s => s.status === "approved") || [];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout>
        <div dir="rtl">
          <div className="mb-8 text-right">
            <h1 className="text-3xl font-display font-bold">نظرة عامة على المنصة</h1>
            <p className="text-muted-foreground">المقاييس العالمية والإدارة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="إجمالي الإيرادات" value={`$${stats?.totalRevenue?.toFixed(2) || "0.00"}`} icon={<TrendingUp className="text-green-500" />} />
            <StatCard title="إجمالي الطلبات" value={stats?.totalOrders || 0} icon={<Package className="text-blue-500" />} />
            <StatCard title="المتاجر النشطة" value={stats?.totalStores || 0} icon={<Building2 className="text-indigo-500" />} />
            <StatCard title="الموافقات المعلقة" value={stats?.pendingStores || pendingStores.length} icon={<ShieldAlert className="text-orange-500" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-border/60 shadow-md">
              <CardHeader className="bg-muted/30 border-b border-border/40 pb-4 text-right">
                <CardTitle className="text-lg flex items-center gap-2 justify-end">
                  موافقات المتاجر ({pendingStores.length})
                  <ShieldAlert className="w-5 h-5 text-warning" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {pendingStores.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">لا توجد متاجر معلقة للمراجعة.</div>
                ) : (
                  <div className="divide-y">
                    {pendingStores.map(store => (
                      <div key={store.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-muted/20 transition-colors text-right">
                        <div className="w-full">
                          <h4 className="font-bold">{store.name}</h4>
                          <p className="text-sm text-muted-foreground">{store.description}</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-success text-success hover:bg-success/10" onClick={() => updateStatus({ id: store.id, status: "approved" })}>
                            <Check className="w-4 h-4 ml-1" /> قبول
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-destructive text-destructive hover:bg-destructive/10" onClick={() => updateStatus({ id: store.id, status: "rejected" })}>
                            <X className="w-4 h-4 ml-1" /> رفض
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-md">
              <CardHeader className="bg-muted/30 border-b border-border/40 pb-4 text-right">
                <CardTitle className="text-lg">البائعين النشطين</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {activeStores.map(store => (
                    <div key={store.id} className="p-4 flex justify-between items-center hover:bg-muted/20 transition-colors text-right">
                      <StatusBadge status={store.status} />
                      <div>
                        <h4 className="font-semibold text-sm">{store.name}</h4>
                        <p className="text-xs text-muted-foreground">معرف: {store.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card className="border-border/50 shadow-sm hover-elevate group">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className="p-3 bg-muted rounded-xl">{icon}</div>
      </CardContent>
    </Card>
  );
}
