import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useStore } from "@/hooks/use-stores";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/lib/cart-context";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StoreDetails() {
  const { id } = useParams();
  const storeId = parseInt(id || "0");
  const { data: store, isLoading: storeLoading } = useStore(storeId);
  const { data: products, isLoading: productsLoading } = useProducts(storeId);
  const { addToCart } = useCart();
  const { toast } = useToast();

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
              <p className="text-muted-foreground text-lg max-w-2xl">{store.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">المنتجات</h2>
          </div>

          {products?.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
              <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-30" />
              <p className="text-muted-foreground">لا توجد منتجات في هذا المتجر حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.map(product => (
                <div key={product.id} className="bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-colors flex flex-col hover-elevate">
                  <div className="h-40 bg-muted/30 flex items-center justify-center p-4">
                    <img src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"} alt={product.name} className="w-full h-full object-cover rounded-lg shadow-sm" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{product.name}</h3>
                      <span className="font-semibold text-primary">${parseFloat(product.price as string).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1">{product.description}</p>
                    
                    <Button 
                      onClick={() => handleAdd(product)} 
                      className="w-full active-scale" 
                      variant="secondary"
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? <><Plus className="w-4 h-4 mr-2" /> إضافة للسلة</> : "نفد من المخزون"}
                    </Button>
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
