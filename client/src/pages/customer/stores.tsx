import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useStores } from "@/hooks/use-stores";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Search, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CustomerStores() {
  const { data: stores, isLoading } = useStores();
  const [search, setSearch] = useState("");

  const activeStores = stores?.filter(s => s.status === "approved") || [];
  const filtered = activeStores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <Layout>
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display mb-2">استكشف المتاجر</h1>
            <p className="text-muted-foreground">ابحث عن أفضل المنتجات من البائعين الموثوقين لدينا.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="ابحث عن المتاجر..." 
              className="pr-9 bg-card border-border/50 focus:ring-primary/20"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-muted/50 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold">لم يتم العثور على متاجر</h3>
            <p className="text-muted-foreground">جرب تعديل بحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((store, i) => (
              <Link key={store.id} href={`/stores/${store.id}`}>
                <Card className={`h-full cursor-pointer hover-elevate overflow-hidden border-border/50 group stagger-${(i%4)+1} animate-fade-in-up`}>
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center border-b">
                    <Building2 className="w-10 h-10 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{store.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{store.description || "لا يوجد وصف متوفر."}</p>
                    
                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[10px] group-hover:translate-x-0 duration-300">
                      عرض المنتجات <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
