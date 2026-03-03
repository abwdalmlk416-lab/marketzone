import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50" dir="rtl">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-right">
          <div className="flex mb-4 gap-2 justify-end">
            <h1 className="text-2xl font-bold text-gray-900">404 الصفحة غير موجودة</h1>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <p className="mt-4 text-sm text-gray-600">
            هل نسيت إضافة الصفحة إلى الموجه (router)؟
          </p>
          <div className="mt-6">
            <a href="/" className="text-primary hover:underline">العودة للرئيسية</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
