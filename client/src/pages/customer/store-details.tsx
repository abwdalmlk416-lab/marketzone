import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useStore } from "@/hooks/use-stores";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/lib/cart-context";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ShoppingCart, Search, Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAverageRating, useRatings, useCreateRating } from "@/hooks/use-ratings";
import { useAuth } from "@/hooks/use-auth";
import { StarRating } from "@/components/star-rating";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function RateDialog({ type, id, label }: { type: 'product' | 'store', id: number, label: string }) {
  const [open, setOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutateAsync: createRating, isPending } = useCreateRating(type, id);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating === 0) return;
    try {
      await createRating({ rating: selectedRating, comment });
      toast({ title: "تم إرسال التقييم", description: "شكراً لك على تقييمك!" });
      setOpen(false);
      setSelectedRating(0);
      setComment("");
    } catch {
      toast({ title: "خطأ", description: "فشل في إرسال التقييم", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs gap-1">
          <Star className="w-3 h-3" /> قيّم {label}
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">تقييم {label}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <Label className="block mb-2">التقييم</Label>
            <StarRating value={selectedRating} onChange={setSelectedRating} size="lg" />
          </div>
          <div>
            <Label className="block mb-2">التعليق (اختياري)</Label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              className="text-right"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending || selectedRating === 0}>
            إرسال التقييم
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProductRating({ productId }: { productId: number }) {
  const { data } = useAverageRating({ productId });
  const avg = data?.average || 0;
  if (avg === 0) return null;
  return (
    <div className="flex items-center gap-1 mt-1">
      <StarRating value={Math.round(avg)} readonly size="sm" />
      <span className="text-xs text-muted-foreground">{avg.toFixed(1)}</span>
    </div>
  );
}

export default function StoreDetails() {
  const { id } = useParams();
  const storeId = parseInt(id || "0");
  const { data: store, isLoading: storeLoading } = useStore(storeId);
  const { data: products, isLoading: productsLoading } = useProducts(storeId);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: storeAvgData } = useAverageRating({ storeId });
  const storeAvg = storeAvgData?.average || 0;

  const categories = Array.from(new Set(products?.map(p => p.category).filter(Boolean) || []));

  const filteredProducts = (products || [])
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return parseFloat(a.price as string) - parseFloat(b.price as string);
      if (sortBy === "price_desc") return parseFloat(b.price as string) - parseFloat(a.price as string);
      return 0;
    });

  const handleAdd = (product: any) => {
    addToCart(product);
    toast({ title: "تمت الإضافة للسلة", description: `تم إضافة ${product.name} بنجاح.` });
  };

  if (storeLoading || productsLoading) return <Layout><div className="p-8" dir="rtl">جاري التحميل...</div></Layout>;
  if (!store) return <Layout><div className="p-8" dir="rtl">المتجر غير موجود</div></Layout>;

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <Layout>
        <div dir="rtl" className="text-right">
          <Button variant="ghost" size="sm" asChild className="mb-6 -mr-3 text-muted-foreground hover:text-foreground">
            <Link href="/customer"><ChevronLeft className="w-4 h-4 ml-1 rotate-180" /> العودة للمتاجر</Link>
          </Button>

          <div className="bg-card rounded-2xl p-8 mb-8 border border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <h1 className="text-4xl font-display font-bold mb-2">{store.name}</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mb-3">{store.description}</p>
              <div className="flex items-center gap-3 flex-wrap">
                {storeAvg > 0 ? (
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(storeAvg)} readonly size="md" />
                    <span className="text-sm text-muted-foreground font-medium">{storeAvg.toFixed(1)} / 5</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">لا يوجد تقييم بعد</span>
                )}
                {user && <RateDialog type="store" id={storeId} label="المتجر" />}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold font-display">المنتجات</h2>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-56">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن منتج..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pr-9 text-right"
                />
              </div>
              {categories.length > 0 && (
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 text-right">
                    <SelectValue placeholder="الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 text-right">
                  <SelectValue placeholder="الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">الترتيب الافتراضي</SelectItem>
                  <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
              <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-30" />
              <p className="text-muted-foreground">لا توجد منتجات مطابقة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-colors flex flex-col hover-elevate">
                  <div className="h-40 bg-muted/30 flex items-center justify-center p-4">
                    <img src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"} alt={product.name} className="w-full h-full object-cover rounded-lg shadow-sm" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold">{product.name}</h3>
                      <span className="font-semibold text-primary">${parseFloat(product.price as string).toFixed(2)}</span>
                    </div>
                    <ProductRating productId={product.id} />
                    {product.category && (
                      <span className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-0.5 w-fit mt-1">{product.category}</span>
                    )}
                    <p className="text-xs text-muted-foreground mb-3 mt-2 line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleAdd(product)}
                        className="w-full active-scale"
                        variant="secondary"
                        disabled={product.stock <= 0}
                      >
                        {product.stock > 0 ? <><Plus className="w-4 h-4 mr-2" /> إضافة للسلة</> : "نفد من المخزون"}
                      </Button>
                      {user && <RateDialog type="product" id={product.id} label="المنتج" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
