import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { usePlatformAnalytics } from "@/hooks/use-analytics";
import { useStores, useUpdateStoreStatus } from "@/hooks/use-stores";
import { useOrders } from "@/hooks/use-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Check, X, ShieldAlert, TrendingUp, Users, Building2, Package, ShoppingCart } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  accepted: "#3b82f6",
  picking_up: "#8b5cf6",
  delivering: "#06b6d4",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "معلق",
  accepted: "مقبول",
  picking_up: "يُستلم",
  delivering: "يُوصّل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function AdminDashboard() {
  const { data: stats } = usePlatformAnalytics();
  const { data: stores } = useStores();
  const { data: orders } = useOrders({ role: "admin" });
  const { mutate: updateStatus } = useUpdateStoreStatus();

  const pendingStores = stores?.filter(s => s.status === "pending") || [];
  const activeStores = stores?.filter(s => s.status === "approved") || [];

  // Orders by status for pie chart
  const ordersByStatus = Object.entries(
    (orders || []).reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    status,
  }));

  // Revenue by store for bar chart
  const revenueByStore = activeStores
    .map(store => ({
      name: store.name.length > 12 ? store.name.slice(0, 12) + "…" : store.name,
      revenue: (orders || [])
        .filter(o => o.storeId === store.id && o.status === "completed")
        .reduce((sum, o) => sum + parseFloat(o.totalAmount as string), 0),
    }))
    .filter(s => s.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout>
        <div dir="rtl">
          <div className="mb-8 text-right">
            <h1 className="text-3xl font-display font-bold">نظرة عامة على المنصة</h1>
            <p className="text-muted-foreground">المقاييس العالمية والإدارة</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="إجمالي الإيرادات" value={`$${(stats as any)?.totalRevenue?.toFixed(2) || "0.00"}`} icon={<TrendingUp className="text-green-500" />} color="from-green-500/10 to-emerald-500/5" />
            <StatCard title="إجمالي الطلبات" value={(stats as any)?.totalOrders || 0} icon={<Package className="text-blue-500" />} color="from-blue-500/10 to-blue-500/5" />
            <StatCard title="المتاجر النشطة" value={(stats as any)?.totalStores || 0} icon={<Building2 className="text-indigo-500" />} color="from-indigo-500/10 to-indigo-500/5" />
            <StatCard title="المستخدمون" value={(stats as any)?.totalUsers || 0} icon={<Users className="text-orange-500" />} color="from-orange-500/10 to-orange-500/5" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Orders by Status - Pie Chart */}
            <Card className="border-border/60 shadow-md">
              <CardHeader className="border-b border-border/40 pb-4 text-right">
                <CardTitle className="text-lg flex items-center gap-2 justify-end">
                  حالة الطلبات
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {ordersByStatus.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">لا توجد طلبات بعد</div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      {ordersByStatus.map(item => (
                        <div key={item.status} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[item.status] || "#94a3b8" }} />
                          <span className="text-muted-foreground flex-1">{item.name}</span>
                          <span className="font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={ordersByStatus} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={48}>
                            {ordersByStatus.map(entry => (
                              <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#94a3b8"} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: 12 }}
                            formatter={(value, name) => [value, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue by Store - Bar Chart */}
            <Card className="border-border/60 shadow-md">
              <CardHeader className="border-b border-border/40 pb-4 text-right">
                <CardTitle className="text-lg flex items-center gap-2 justify-end">
                  إيرادات المتاجر
                  <TrendingUp className="w-5 h-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {revenueByStore.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">لا توجد إيرادات بعد</div>
                ) : (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueByStore} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                          formatter={(v: number) => [`$${v.toFixed(2)}`, "الإيرادات"]}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Store Management Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Approvals */}
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

            {/* Active Stores */}
            <Card className="border-border/60 shadow-md">
              <CardHeader className="bg-muted/30 border-b border-border/40 pb-4 text-right">
                <CardTitle className="text-lg">المتاجر النشطة ({activeStores.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-80 overflow-y-auto">
                {activeStores.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">لا توجد متاجر نشطة.</div>
                ) : (
                  <div className="divide-y">
                    {activeStores.map(store => (
                      <div key={store.id} className="p-4 flex justify-between items-center hover:bg-muted/20 transition-colors text-right">
                        <StatusBadge status={store.status} />
                        <div>
                          <h4 className="font-semibold text-sm">{store.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            إيرادات: ${(orders || []).filter(o => o.storeId === store.id && o.status === "completed").reduce((s, o) => s + parseFloat(o.totalAmount as string), 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          {(orders || []).length > 0 && (
            <Card className="mt-8 border-border/60 shadow-md">
              <CardHeader className="border-b border-border/40 pb-4 text-right">
                <CardTitle className="text-lg">آخر الطلبات</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {(orders || []).slice(0, 8).map(o => (
                    <div key={o.id} className="p-4 flex justify-between items-center hover:bg-muted/20 text-right">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={o.status} />
                        <span className="text-sm font-medium text-primary">${parseFloat(o.totalAmount as string).toFixed(2)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">طلب #{o.id}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{o.deliveryAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color?: string }) {
  return (
    <Card className="border-border/50 shadow-sm hover-elevate group overflow-hidden">
      <CardContent className="p-6 flex justify-between items-center relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${color || 'from-primary/5 to-transparent'} opacity-60`} />
        <div className="relative z-10">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className="p-3 bg-background/80 rounded-xl relative z-10 shadow-sm">{icon}</div>
      </CardContent>
    </Card>
  );
}
