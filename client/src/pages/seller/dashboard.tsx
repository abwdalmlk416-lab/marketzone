import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useStores, useCreateStore } from "@/hooks/use-stores";
import { useProducts, useCreateProduct } from "@/hooks/use-products";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useStoreAnalytics } from "@/hooks/use-analytics";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { Store as StoreIcon, Package, DollarSign, Clock, Plus, Settings } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { data: stores, isLoading: storesLoading } = useStores();
  
  // Find seller's store (assuming 1 per seller for MVP)
  const myStore = stores?.find(s => s.sellerId === user?.id);

  if (storesLoading) return <Layout><div className="p-8" dir="rtl">جاري التحميل...</div></Layout>;

  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <Layout>
        <div dir="rtl">
          {!myStore ? (
            <CreateStoreView userId={user!.id} />
          ) : myStore.status === "pending" ? (
            <PendingStoreView />
          ) : myStore.status === "rejected" ? (
            <div className="p-8 text-center bg-destructive/10 text-destructive rounded-xl border border-destructive/20">تم رفض طلب متجرك. تواصل مع الدعم.</div>
          ) : (
            <ActiveStoreDashboard storeId={myStore.id} storeName={myStore.name} />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function CreateStoreView({ userId }: { userId: number }) {
  const { mutateAsync: createStore, isPending } = useCreateStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStore({ sellerId: userId, name, description: desc, status: "pending" });
  };

  return (
    <div className="max-w-md mx-auto pt-10 text-right">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <StoreIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-display font-bold">افتح متجرك</h1>
        <p className="text-muted-foreground mt-2">انضم إلى MarketZone وابدأ البيع لآلاف العملاء.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>اسم المتجر</Label>
              <Input required value={name} onChange={e => setName(e.target.value)} className="text-right" />
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Input required value={desc} onChange={e => setDesc(e.target.value)} className="text-right" />
            </div>
            <Button className="w-full mt-4" type="submit" disabled={isPending}>إرسال الطلب</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PendingStoreView() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <Clock className="w-16 h-16 text-warning mb-4 animate-pulse" />
      <h2 className="text-2xl font-bold mb-2">المتجر قيد المراجعة</h2>
      <p className="text-muted-foreground max-w-md">تم إرسال طلب متجرك وهو قيد المراجعة حالياً من قبل المسؤول. يرجى التحقق لاحقاً.</p>
    </div>
  );
}

function ActiveStoreDashboard({ storeId, storeName }: { storeId: number, storeName: string }) {
  const { data: analytics } = useStoreAnalytics(storeId);
  const { data: products } = useProducts(storeId);
  const { data: orders } = useOrders({ role: "seller", userId: storeId.toString() }); // Assuming backend filters correctly by storeId for seller
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutateAsync: createProduct, isPending: isAddingProduct } = useCreateProduct();
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Filter orders related to this store only (if backend didn't)
  const storeOrders = orders?.filter(o => o.storeId === storeId) || [];

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createProduct({
      storeId,
      name: fd.get("name") as string,
      price: fd.get("price") as string,
      stock: parseInt(fd.get("stock") as string),
      description: fd.get("desc") as string,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" // mock image
    });
    setDialogOpen(false);
  };

  // Mock chart data
  const chartData = [
    { name: 'الاثنين', revenue: 400 }, { name: 'الثلاثاء', revenue: 300 },
    { name: 'الأربعاء', revenue: 550 }, { name: 'الخميس', revenue: 450 },
    { name: 'الجمعة', revenue: 700 }, { name: 'السبت', revenue: 800 },
    { name: 'الأحد', revenue: 950 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-right">
          <h1 className="text-3xl font-display font-bold">لوحة تحكم المتجر</h1>
          <p className="text-muted-foreground">{storeName}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate"><Plus className="w-4 h-4 ml-2" /> إضافة منتج</Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة منتج جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4 text-right">
              <div><Label>الاسم</Label><Input name="name" required className="text-right" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>السعر ($)</Label><Input name="price" type="number" step="0.01" required className="text-right" /></div>
                <div><Label>كمية المخزون</Label><Input name="stock" type="number" required className="text-right" /></div>
              </div>
              <div><Label>الوصف</Label><Input name="desc" className="text-right" /></div>
              <Button type="submit" className="w-full" disabled={isAddingProduct}>حفظ المنتج</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-0 shadow-lg shadow-primary/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="text-right">
                <p className="text-primary-foreground/80 text-sm font-medium mb-1">إجمالي الإيرادات</p>
                <h3 className="text-3xl font-bold">${analytics?.totalRevenue?.toFixed(2) || "0.00"}</h3>
              </div>
              <div className="p-2 bg-white/20 rounded-lg"><DollarSign className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="text-right">
                <p className="text-muted-foreground text-sm font-medium mb-1">إجمالي الطلبات</p>
                <h3 className="text-3xl font-bold">{analytics?.totalOrders || 0}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg"><Package className="w-5 h-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="text-right">
                <p className="text-muted-foreground text-sm font-medium mb-1">المنتجات النشطة</p>
                <h3 className="text-3xl font-bold">{products?.length || 0}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg"><Settings className="w-5 h-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-right">نظرة عامة على الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-right">الطلبات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[300px]">
            {storeOrders.length === 0 ? (
               <p className="text-muted-foreground text-center py-8 text-sm">لا توجد طلبات أخيرة</p>
            ) : (
              <div className="space-y-4">
                {storeOrders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex flex-col gap-2 pb-4 border-b last:border-0 last:pb-0 text-right">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">طلب #{o.id}</span>
                      <span className="font-bold text-primary text-sm">${parseFloat(o.totalAmount as string).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <StatusBadge status={o.status} />
                      {o.status === "pending" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus({ id: o.id, status: "accepted" })}>
                          قبول
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">مخزون المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products?.map(p => (
              <div key={p.id} className="border rounded-lg p-3 flex flex-col gap-2 relative group text-right">
                 <p className="font-semibold text-sm truncate">{p.name}</p>
                 <div className="flex justify-between text-sm">
                   <span className="text-primary">${parseFloat(p.price as string).toFixed(2)}</span>
                   <span className="text-muted-foreground">المخزون: {p.stock}</span>
                 </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
