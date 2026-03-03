# 🆓 النشر المجاني 100% - بدون بطاقة مصرفية

## الخيار الأول: Neon (PostgreSQL مجاني)

### 1. أنشئ حساب Neon
https://neon.tech

- سجّل بـ GitHub
- أنشئ مشروع جديد: `marketzone`
- انسخ **Connection String** (مثل: `postgres://user:pass@ep-xxx.us-east-1.aws.neon.tech/marketzone`)

### 2. أنشئ حساب Cyclic
https://app.cyclic.io

- سجّل بـ GitHub
- اختار: `abwdalmlk416-lab/marketzone`
- **Build**: `npm install && npm run build`
- **Start**: `npm start`

### 3. أضف المتغيرات في Cyclic:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://... (من Neon)
SESSION_SECRET=any-random-string
```

---

## الخيار الثاني: Railway (له حد مجاني)

### 1. أنشئ حساب Railway
https://railway.app

- سجّل بـ GitHub
- أنشئ مشروع جديد
- أضف PostgreSQL plugin (مجاني)

### 2. اربط المشروع
- اختر repo: `abwdalmlk416-lab/marketzone`
- **Build**: `npm install && npm run build`
- **Start**: `npm start`

---

## الخيار الثالث: Glitch ( الأسهل! )

### 1. أنشئ حساب Glitch
https://glitch.com

### 2. أنشئ مشروع جديد
- اضغط "New Project"
- اختر "glitch-hello-node"

### 3. احذف وأعد رفع الملفات
- امسح الملفات الموجودة
- ارفع ملفات المشروع

### 4. أضف قاعدة بيانات
- اضغط "Tools" > "Database"
- احصل على رابط قاعدة البيانات

---

## ✅ النتيجة المتوقعة:
```
https://your-app.cyclic.app
# أو
https://your-app.railway.app
# أو  
https://your-app.glitch.me
```

---

## 💡 نصيحتي:
جرب **Cyclic + Neon** - الأسهل والأكثر استقراراً للمبتدئين!

