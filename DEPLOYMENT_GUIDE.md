# تقرير نشر منصة MarketZone

## 📊 ملخص المشروع

**MarketZone** - منصة تسوق إلكترونية متعددة البائعين

### هيكل المشروع:
- **Frontend**: Vite + React (مجلد `client`)
- **Backend**: Express + TypeScript (مجلد `server`)
- **قاعدة البيانات**: PostgreSQL مع Drizzle ORM

---

## ✅ الخطوة 1: حالة GitHub

المشروع متصل بالفعل بـ GitHub:
```
Repository: https://github.com/abwdalmlk416-lab/marketzone.git
Branch: main
```

---

## 🚀 الخطوة 2: نشر Backend على Render (مجاني)

### الخطوات:

1. **اذهب إلى**: https://dashboard.render.com

2. **أنشئ Web Service جديد**:
   - انقر على "New" → "Web Service"
   - Connect repository: `abwdalmlk416-lab/marketzone`
   - Root directory: `/` (الجذر)

3. **إعدادات البناء**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Environment Variables** أضف:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your-postgresql-connection-string>
   SESSION_SECRET=your-secret-key-here
   ```

5. **انقر "Create Web Service"**

---

## 🔗 روابط النشر النهائية (بعد النشر)

| الخدمة | الرابط |
|-------|--------|
| الموقع | `https://marketzone.onrender.com` |
| API | `https://marketzone.onrender.com/api/*` |

---

## ⚠️ ملاحظات مهمة

1. **قاعدة البيانات**: ستحتاج لإنشاء PostgreSQL database على Render أيضاً (مجاني)

2. **متغيرات البيئة المطلوبة**:
   - `DATABASE_URL` - رابط قاعدة البيانات
   - `SESSION_SECRET` - مفتاح سري للجلسات

3. **حدود الخطة المجانية**:
   - 750 ساعة/月
   - الموقع يتوقف بعد 15 دقيقة من عدم النشاط
   - يستيقظ تلقائياً عند الطلب

---

## 📝 أوامر مفيدة

### لتشغيل المشروع محلياً:
```bash
npm install
npm run dev
```

### لبناء المشروع:
```bash
npm run build
npm start
```

---

## 🔍 للتحقق من حالة النشر

بعد النشر، اختبر الروابط:
- `https://your-app.onrender.com/` - الصفحة الرئيسية
- `https://your-app.onrender.com/api/stores` - اختبار API
