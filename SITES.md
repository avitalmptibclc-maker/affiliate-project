# 🗂️ מרשם דפי הנחיתה

הקובץ הזה מרכז את **כל** דפי הנחיתה — כדי שלא נתבלבל בין דפים, טבלאות ומוצרים.
**כל פעם שמוסיפים דף חדש — מוסיפים כאן שורה.**

---

## 📛 מוסכמת שמות (אחיד לכל דף)
לכל דף בוחרים **שם-מזהה אחד באנגלית** (slug), והוא חוזר בכל מקום:

| איפה | דוגמה (slug = `physiomotion`) |
|------|-------------------------------|
| תיקייה בקוד | `sites/physiomotion/` |
| טבלה ב-Supabase | `physiomotion_products` |
| פרויקט ב-Vercel | `physiomotion` |
| כתובת | `physiomotion.vercel.app` |

ככה, אם רואים טבלה בשם `physiomotion_products` — יודעים מיד לאיזה דף היא שייכת.

---

## 📋 הדפים הקיימים

### 1. יועצות ההנקה של אילת
- **תיקייה:** `sites/yoatsot-eilat/`
- **Supabase:** `consultants` + `pending_consultants` _(השם המקורי, בלי קידומת)_
- **סוג:** מאגר יועצות + טופס הצטרפות + ניהול
- **כתובת:** מתפרסם בנפרד (פרויקט Vercel `yoatsot-hanaka-eilat`)

### 2. ההמלצות של אביטל (אפיליאייט)
- **תיקייה:** `sites/affiliate/`
- **Supabase:** `affiliate_products`
- **סיסמת ניהול:** `5845`
- **סוג:** קישור בביו — 4 מגירות, מוצרי אפיליאייט
- **כתובת:** https://affiliate-project-avital.vercel.app

---

## ➕ דף חדש — צ'קליסט מהיר
1. בחרי **slug** באנגלית (למשל `physiomotion`)
2. העתיקי את `_template-linkbio/` ל-`sites/<slug>/`
3. ב-`index.html` עדכני: `SITE_PREFIX`, `ADMIN_CODE`, `BRAND_NAME`, וכו'
4. ב-`tables.sql` החליפי `__PREFIX__` ל-slug → הריצי ב-Supabase
5. פרסמי ב-Vercel (Root Directory = `sites/<slug>`)
6. **הוסיפי כאן שורה חדשה** עם כל הפרטים 👆

---

## ⏳ דפים מתוכננים
- **פייזומיישן / PhysioMotion** — (בבנייה)
