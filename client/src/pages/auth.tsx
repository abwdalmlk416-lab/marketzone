import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState("admin@marketzone.com");
  const [loginPassword, setLoginPassword] = useState("password");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("customer");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ emailOrPhone: loginEmail, password: loginPassword });
      redirectBasedOnRole(res.user.role);
    } catch (err: any) {
      toast({ title: "فشل تسجيل الدخول", description: "يرجى التحقق من بيانات الاعتماد الخاصة بك.", variant: "destructive" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: regRole,
      });
      
      // Show success message based on role
      const roleMessages: Record<string, string> = {
        customer: "مرحباً بك! يمكنك الآن تصفح المتاجر والطلب منها.",
        seller: "تم إنشاء حسابك كبائع. يمكنك الآن إنشاء متجرك.",
        driver: "تم إنشاء حسابك كسائق. يمكنك الآن بدء العمل."
      };
      
      toast({ 
        title: "🎉 تم إنشاء الحساب بنجاح", 
        description: roleMessages[regRole] || "مرحباً بك في MarketZone",
        variant: "default"
      });
      
      redirectBasedOnRole(res.user.role);
    } catch (err: any) {
      // Handle specific error messages
      const errorMessage = err.message?.includes("unique") 
        ? "البريد الإلكتروني أو الهاتف مسجل مسبقاً"
        : "تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.";
        
      toast({ title: "فشل التسجيل", description: errorMessage, variant: "destructive" });
    }
  };

  const demoLogin = async (role: string) => {
    const credentials: Record<string, any> = {
      customer: { emailOrPhone: "customer@test.com", password: "password", name: "عميل تجريبي", phone: "1111" },
      seller: { emailOrPhone: "seller@test.com", password: "password", name: "بائع تجريبي", phone: "2222" },
      driver: { emailOrPhone: "driver@test.com", password: "password", name: "سائق تجريبي", phone: "3333" },
      admin: { emailOrPhone: "admin@test.com", password: "password", name: "مدير تجريبي", phone: "4444" },
    };
    const cred = credentials[role];
    try {
      const res = await login({ emailOrPhone: cred.emailOrPhone, password: cred.password });
      redirectBasedOnRole(res.user.role);
    } catch (e) {
      try {
         const res = await register({ ...cred, role });
         redirectBasedOnRole(res.user.role);
      } catch(e2: any) {
        toast({ title: "فشل الدخول التجريبي", description: "تعذر إنشاء حساب تجريبي", variant: "destructive" });
      }
    }
  };

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "admin": setLocation("/admin"); break;
      case "seller": setLocation("/seller"); break;
      case "driver": setLocation("/driver"); break;
      default: setLocation("/customer"); break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30" dir="rtl">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Package className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold">مرحباً بك في MarketZone</h1>
          <p className="text-muted-foreground text-sm">سجل الدخول إلى حسابك</p>
        </div>

        <Card className="shadow-xl shadow-black/5 border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">دخول</TabsTrigger>
                <TabsTrigger value="register">تسجيل</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 text-right">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="text-right" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input id="password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="text-right" />
                  </div>
                  <Button type="submit" className="w-full hover-elevate active-scale" disabled={isLoggingIn}>
                    {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                    تسجيل الدخول
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 text-right">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">الاسم الكامل</Label>
                    <Input id="reg-name" value={regName} onChange={e => setRegName(e.target.value)} required className="text-right" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">البريد الإلكتروني</Label>
                      <Input id="reg-email" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required className="text-right" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">الهاتف</Label>
                      <Input id="reg-phone" value={regPhone} onChange={e => setRegPhone(e.target.value)} required className="text-right" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">كلمة المرور</Label>
                    <Input id="reg-password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required className="text-right" />
                  </div>
                  <div className="space-y-2">
                    <Label>الدور</Label>
                    <Select value={regRole} onValueChange={setRegRole}>
                      <SelectTrigger dir="rtl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="customer">عميل</SelectItem>
                        <SelectItem value="seller">بائع</SelectItem>
                        <SelectItem value="driver">سائق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full hover-elevate active-scale" disabled={isRegistering}>
                    {isRegistering ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                    إنشاء حساب
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">حسابات تجريبية</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => demoLogin('customer')} disabled={isLoggingIn || isRegistering}>عميل</Button>
              <Button variant="outline" size="sm" onClick={() => demoLogin('seller')} disabled={isLoggingIn || isRegistering}>بائع</Button>
              <Button variant="outline" size="sm" onClick={() => demoLogin('driver')} disabled={isLoggingIn || isRegistering}>سائق</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
