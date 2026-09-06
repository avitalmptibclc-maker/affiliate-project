// ⚠️ קובץ מקומפל אוטומטית מ-app.jsx — אין לערוך ידנית! ערכו את app.jsx והריצו: node build.mjs
const {
  useState,
  useEffect
} = React;

/* ====== חיבור ל-Supabase (מסד נתונים בענן) ====== */
const SUPABASE_URL = "https://ucodslcraqotfkjpbqvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjb2RzbGNyYXFvdGZranBicXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NTc0MDksImV4cCI6MjA5NzAzMzQwOX0.pZPR3XRqiy_hiwgI8NEsEAGo_3XBNiEdKrwgypcgI8A";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// המרה בין מבנה הנתונים באתר (additionalFields) לעמודות במסד (additional_fields)
const fromDb = row => ({
  id: row.id,
  name: row.name || '',
  credentials: row.credentials || '',
  statement: row.statement || '',
  location: row.location || '',
  channels: row.channels || {},
  additionalFields: row.additional_fields || '',
  phone: row.phone || '',
  image: row.image || null,
  instagram: row.instagram || '',
  facebook: row.facebook || '',
  website: row.website || ''
});
const toDb = c => ({
  name: c.name || '',
  credentials: c.credentials || '',
  statement: c.statement || '',
  location: c.location || '',
  channels: c.channels || {},
  additional_fields: c.additionalFields || '',
  phone: c.phone || '',
  image: c.image || null,
  instagram: c.instagram || '',
  facebook: c.facebook || '',
  website: c.website || ''
});

/* ====== אייקונים מוטמעים (בסגנון lucide) ====== */
const Icon = ({
  children,
  size = 20,
  className
}) => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: className,
  "aria-hidden": "true",
  focusable: "false"
}, children);
const Shield = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
}));
const Phone = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
}));
const MessageCircle = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
}));
const Check = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "20 6 9 17 4 12"
}));
const Upload = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "17 8 12 3 7 8"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "3",
  x2: "12",
  y2: "15"
}));
const MapPin = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));
const Eye = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "3"
}));
const Trash = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "3 6 5 6 21 6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
}));
const Lock = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "11",
  width: "18",
  height: "11",
  rx: "2",
  ry: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7 11V7a5 5 0 0 1 10 0v4"
}));
const Pencil = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 20h9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
}));
const Instagram = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
  x: "2",
  y: "2",
  width: "20",
  height: "20",
  rx: "5",
  ry: "5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
}), /*#__PURE__*/React.createElement("line", {
  x1: "17.5",
  y1: "6.5",
  x2: "17.51",
  y2: "6.5"
}));
const Facebook = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
}));
const Globe = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  y1: "12",
  x2: "22",
  y2: "12"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
}));
const Accessibility = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "4",
  r: "1.6",
  fill: "currentColor",
  stroke: "none"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5 8h14"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 8v7"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 15l-3.5 5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 15l3.5 5"
}));

/* ====== רכיב לוגו (נופל לעיגול גרדיאנט אם אין logo.png) ====== */
const Logo = ({
  size = 40
}) => {
  const [err, setErr] = useState(false);
  if (err) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: size,
        height: size
      },
      className: "rounded-full bg-gradient-to-tr from-[#f4a284] to-[#e8b4b8] flex items-center justify-center text-[#5a3a28] font-bold"
    }, "\u05D0");
  }
  return /*#__PURE__*/React.createElement("img", {
    src: "logo.png",
    onError: () => setErr(true),
    style: {
      width: size,
      height: size
    },
    className: "rounded-full object-cover",
    alt: "\u05DC\u05D5\u05D2\u05D5"
  });
};

/* ====== תמונת פרופיל (נופלת לאות ראשונה אם אין תמונה) ====== */
const Avatar = ({
  src,
  name,
  className
}) => {
  const letter = (name || "?").trim().charAt(0);
  if (src) return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    className: className + " object-cover"
  });
  return /*#__PURE__*/React.createElement("div", {
    className: className + " bg-gradient-to-tr from-[#f4a284] to-[#e8b4b8] flex items-center justify-center text-[#5a3a28] text-3xl font-bold"
  }, letter);
};

/* ====== קריאת קובץ תמונה ל-data URL ====== */
const readImage = (file, cb) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => cb(e.target.result);
  reader.readAsDataURL(file);
};

// קופות חולים / טיפת חלב שדרכן היועצת מקבלת
const HEALTH_FUNDS = [['clalit', 'כללית'], ['maccabi', 'מכבי'], ['leumit', 'לאומית'], ['meuhedet', 'מאוחדת'], ['tipatChalav', 'טיפת חלב']];
const EMPTY_FORM = {
  name: '',
  credentials: '',
  statement: '',
  location: 'אילת',
  homeVisit: false,
  clinic: false,
  weeklyClinic: false,
  online: false,
  clalit: false,
  maccabi: false,
  leumit: false,
  meuhedet: false,
  tipatChalav: false,
  additionalFields: '',
  phone: '',
  image: null,
  instagram: '',
  facebook: '',
  website: ''
};

// משלים https:// אם הוזן קישור בלי תחילית
const normalizeUrl = url => {
  if (!url) return '#';
  return /^https?:\/\//i.test(url) ? url : 'https://' + url.replace(/^\/+/, '');
};

/* ====== קוד כניסה לפאנל הניהול ולטופס היועצות ====== */
const ADMIN_CODE = "5845";
const CONSULTANT_CODE = "1984"; // קוד גישה לטופס ההצטרפות של היועצות
const AVITAL_WHATSAPP = "972548780808"; // הוואטסאפ של אביטל (לבקשת קוד גישה)

function App() {
  const [view, setView] = useState('home');
  const [consultants, setConsultants] = useState([]);
  const [pending, setPending] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [consultantUnlocked, setConsultantUnlocked] = useState(false);
  const [regCode, setRegCode] = useState('');
  const [regError, setRegError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'a-z' | 'z-a'

  // רשימת היועצות לפי בחירת המיון
  const sortedConsultants = [...consultants].sort((a, b) => {
    if (sortOrder === 'a-z') return (a.name || '').localeCompare(b.name || '', 'he');
    if (sortOrder === 'z-a') return (b.name || '').localeCompare(a.name || '', 'he');
    return 0; // ברירת מחדל — לפי סדר ההוספה
  });

  // טעינת נתונים מ-Supabase בעת כניסה לאתר
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [cRes, pRes] = await Promise.all([sb.from('consultants').select('*').order('id', {
          ascending: true
        }), sb.from('pending_consultants').select('*').order('id', {
          ascending: true
        })]);
        if (cRes.error) throw cRes.error;
        if (pRes.error) throw pRes.error;
        if (!alive) return;
        setConsultants((cRes.data || []).map(fromDb));
        setPending((pRes.data || []).map(fromDb));
      } catch (err) {
        console.error(err);
        if (alive) setLoadError('שגיאה בטעינת הנתונים מהשרת. רענני את הדף ונסי שוב.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const getWhatsAppLink = (phone, name) => {
    const clean = (phone || '').replace(/\D/g, '').replace(/^0/, '972');
    const text = encodeURIComponent(`היי ${name}, הגעתי אלייך דרך דף יועצות ההנקה של אילת 🌸`);
    return `https://wa.me/${clean}?text=${text}`;
  };
  const goAdmin = () => {
    setView('admin');
    if (!adminUnlocked) {
      setCodeInput('');
      setCodeError(false);
    }
  };

  // שליחת בקשת הצטרפות → נשמרת בטבלת הממתינות
  const handleSubmit = async e => {
    e.preventDefault();
    if (saving) return;
    const entry = {
      ...form,
      channels: {
        homeVisit: form.homeVisit,
        clinic: form.clinic,
        weeklyClinic: form.weeklyClinic,
        online: form.online,
        clalit: form.clalit,
        maccabi: form.maccabi,
        leumit: form.leumit,
        meuhedet: form.meuhedet,
        tipatChalav: form.tipatChalav
      }
    };
    setSaving(true);
    try {
      if (!window.supabase || !sb || typeof sb.from !== 'function') {
        throw new Error('ספריית החיבור לשרת (Supabase) לא נטענה. ייתכן שתוסף חוסם בדפדפן או חיבור אינטרנט חלש.');
      }
      const {
        data,
        error
      } = await sb.from('pending_consultants').insert(toDb(entry)).select().single();
      if (error) throw error;
      setPending(prev => [...prev, fromDb(data)]);
      setForm(EMPTY_FORM);
      setView('home');
      alert('הפרטים נשלחו בהצלחה וממתינים לאישור של אביטל! 🌸');
    } catch (err) {
      console.error(err);
      alert('אופס, הייתה תקלה בשליחת הפרטים. נסי שוב בעוד רגע 🙏');
    } finally {
      setSaving(false);
    }
  };

  // אישור בקשה — מקבל את הפרטים אחרי שהמנהלת ערכה אותם
  const approve = async (id, data) => {
    try {
      const {
        data: inserted,
        error
      } = await sb.from('consultants').insert({
        ...toDb(data),
        status: 'approved'
      }).select().single();
      if (error) throw error;
      const {
        error: delErr
      } = await sb.from('pending_consultants').delete().eq('id', id);
      if (delErr) throw delErr;
      setConsultants(prev => [...prev, fromDb(inserted)]);
      setPending(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('הייתה תקלה באישור הבקשה. נסי שוב 🙏');
    }
  };
  const reject = async id => {
    try {
      const {
        error
      } = await sb.from('pending_consultants').delete().eq('id', id);
      if (error) throw error;
      setPending(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('הייתה תקלה בדחיית הבקשה. נסי שוב 🙏');
    }
  };
  const removeConsultant = async id => {
    try {
      const {
        error
      } = await sb.from('consultants').delete().eq('id', id);
      if (error) throw error;
      setConsultants(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('הייתה תקלה בהסרת היועצת. נסי שוב 🙏');
    }
  };

  // עדכון יועצת מפורסמת אחרי עריכה
  const updateConsultant = async (id, data) => {
    try {
      const {
        data: updated,
        error
      } = await sb.from('consultants').update(toDb(data)).eq('id', id).select().single();
      if (error) throw error;
      setConsultants(prev => prev.map(c => c.id === id ? fromDb(updated) : c));
    } catch (err) {
      console.error(err);
      alert('הייתה תקלה בשמירת השינויים. נסי שוב 🙏');
    }
  };
  const navBtn = (key, label) => /*#__PURE__*/React.createElement("button", {
    onClick: () => key === 'admin' ? goAdmin() : setView(key),
    className: `px-3 sm:px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${view === key ? 'bg-[#e8b4b8] text-[#5a3a28] font-medium' : 'text-[#7c533c] hover:bg-[#fcf1e8]'}`
  }, label);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen overflow-x-hidden text-[#7c533c] bg-[#fdfaf6]",
    dir: "rtl"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#f3e1d3] px-3 sm:px-6 py-3 flex justify-between items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView('home'),
    "aria-label": "\u05DE\u05E2\u05D1\u05E8 \u05DC\u05D3\u05E3 \u05D4\u05D1\u05D9\u05EA",
    className: "flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 bg-transparent border-0 p-0 text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex-shrink-0"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 50
  })), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm sm:text-lg text-[#7c533c] truncate"
  }, "\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D4\u05D4\u05E0\u05E7\u05D4 \u05E9\u05DC \u05D0\u05D9\u05DC\u05EA")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1 sm:gap-3 items-center flex-shrink-0"
  }, navBtn('home', 'דף הבית'), navBtn('register', 'הצטרפות לרשימה'), /*#__PURE__*/React.createElement("button", {
    onClick: goAdmin,
    className: `p-2 rounded-full transition flex items-center gap-1 text-sm flex-shrink-0 ${view === 'admin' ? 'bg-[#e8b4b8] text-[#5a3a28]' : 'text-[#a25a62] hover:bg-[#fcf1e8]'}`
  }, /*#__PURE__*/React.createElement(Shield, {
    size: 18
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, "\u05E0\u05D9\u05D4\u05D5\u05DC")))), loading && /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-live": "polite",
    className: "px-6 py-3 bg-[#fdf5ee] text-[#8a5c47] text-sm text-center border-b border-[#f3e1d3]"
  }, "\u05D8\u05D5\u05E2\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD\u2026"), loadError && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    className: "px-6 py-3 bg-[#fbe3df] text-[#a63a32] text-sm text-center border-b border-[#f3c8c2]"
  }, loadError), view === 'home' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    className: "pt-4 pb-12 px-6 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#fdf5ee] to-[#fdfaf6] rounded-3xl mt-6 border border-[#f5e6da]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center -mb-8"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 300
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#7c533c] mb-4"
  }, "\u05D9\u05E9 \u05DE\u05DC\u05D0 \u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D4\u05E0\u05E7\u05D4 \u05D1\u05D0\u05D9\u05DC\u05EA!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xl sm:text-2xl text-[#8a5c47] max-w-2xl mx-auto font-light leading-relaxed"
  }, "\u05D1\u05D7\u05E8\u05D9 \u05D0\u05EA \u05D9\u05D5\u05E2\u05E6\u05EA \u05D4\u05D4\u05E0\u05E7\u05D4 \u05E9\u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05DC\u05DA -", /*#__PURE__*/React.createElement("br", null), "\u05DC\u05D9\u05D5\u05D5\u05D9 \u05E8\u05DA, \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05D5\u05E7\u05E8\u05D5\u05D1,", /*#__PURE__*/React.createElement("br", null), "\u05DB\u05D1\u05E8 \u05DE\u05D4\u05E8\u05D2\u05E2 \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF.")), /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-6 mt-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#fdf8f4] border border-[#f3e1d3] rounded-2xl p-5 sm:p-6 text-center shadow-sm"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-lg sm:text-xl text-[#7c533c] leading-relaxed"
  }, "\u05DE\u05E4\u05D2\u05E9 \u05E2\u05DD \u05D9\u05D5\u05E2\u05E6\u05EA \u05D4\u05E0\u05E7\u05D4 \u05DC\u05E4\u05E0\u05D9 \u05D4\u05DC\u05D9\u05D3\u05D4", /*#__PURE__*/React.createElement("br", null), "\u05D9\u05DB\u05D5\u05DC \u05DC\u05D4\u05E7\u05DC \u05DE\u05D0\u05D5\u05D3 \u05E2\u05DC \u05D4\u05D9\u05DE\u05D9\u05DD \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D9\u05DD \u05D0\u05D7\u05E8\u05D9 \u05D4\u05DC\u05D9\u05D3\u05D4.", /*#__PURE__*/React.createElement("br", null), "\u05D7\u05E9\u05D5\u05D1 \u05E9\u05EA\u05E8\u05D2\u05D9\u05E9\u05D9 \u05E9\u05D0\u05EA \u05D1\u05D9\u05D3\u05D9\u05D9\u05DD \u05D8\u05D5\u05D1\u05D5\u05EA \u05D5\u05E9\u05D9\u05E9 \u05DC\u05DE\u05D9 \u05DC\u05E4\u05E0\u05D5\u05EA \u05D1\u05DE\u05E7\u05E8\u05D4 \u05E9\u05DC \u05E7\u05D5\u05E9\u05D9 \u05D1\u05D4\u05E0\u05E7\u05D4."))), /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    className: "max-w-6xl mx-auto px-6 py-12"
  }, !loading && consultants.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-center text-[#8a5c47]"
  }, "\u05E2\u05D3\u05D9\u05D9\u05DF \u05D0\u05D9\u05DF \u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05DE\u05D0\u05D5\u05E9\u05E8\u05D5\u05EA \u05D1\u05D0\u05EA\u05E8."), consultants.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-center gap-2 mb-8"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium text-[#8a5c47] ml-1"
  }, "\u05E1\u05D3\u05E8 \u05DC\u05E4\u05D9:"), [['default', 'ברירת מחדל'], ['a-z', 'א-ת'], ['z-a', 'ת-א']].map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setSortOrder(key),
    "aria-pressed": sortOrder === key,
    className: `px-4 py-2 rounded-full text-sm transition ${sortOrder === key ? 'bg-[#e8b4b8] text-[#5a3a28] font-medium' : 'bg-[#f0e4dc] text-[#7c533c] hover:bg-[#e7d6c9]'}`
  }, label))), /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "\u05E8\u05E9\u05D9\u05DE\u05EA \u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D4\u05D4\u05E0\u05E7\u05D4 \u05D1\u05D0\u05D9\u05DC\u05EA \u05D5\u05D1\u05E1\u05D1\u05D9\u05D1\u05D4"), /*#__PURE__*/React.createElement("div", {
    role: "list",
    className: "grid grid-cols-1 md:grid-cols-2 gap-8"
  }, sortedConsultants.map(coach => /*#__PURE__*/React.createElement("div", {
    role: "listitem",
    key: coach.id,
    className: "bg-white rounded-3xl p-6 shadow-sm border border-[#f3e1d3] transition-all hover:shadow-md flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4 mb-2"
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: coach.image,
    name: coach.name,
    className: "w-24 h-24 rounded-full border-2 border-[#e8b4b8] shadow-sm flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-bold text-[#7c533c] break-words"
  }, coach.name), /*#__PURE__*/React.createElement("p", {
    className: "text-base font-medium text-[#a25a62] mb-2"
  }, coach.credentials), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-sm text-[#8a5c47]"
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 14,
    className: "text-[#f4a284]"
  }), /*#__PURE__*/React.createElement("span", null, coach.location)), /*#__PURE__*/React.createElement(ConsultantSocial, {
    coach: coach
  }))), coach.statement && /*#__PURE__*/React.createElement("blockquote", {
    className: "font-statement bg-[#fdf8f4] border-r-4 border-[#e8b4b8] p-3 rounded-l-xl text-base text-[#8c624c] my-4 leading-relaxed"
  }, "\"", coach.statement, "\""), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 my-4"
  }, coach.channels.homeVisit && /*#__PURE__*/React.createElement("span", {
    className: "bg-[#f0e4dc] text-[#7c533c] text-sm px-3 py-1 rounded-full font-medium"
  }, "\u2713 \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9 \u05D1\u05D9\u05EA"), coach.channels.clinic && /*#__PURE__*/React.createElement("span", {
    className: "bg-[#f0e4dc] text-[#7c533c] text-sm px-3 py-1 rounded-full font-medium"
  }, "\u2713 \u05D8\u05D9\u05E4\u05D5\u05DC \u05D1\u05E7\u05DC\u05D9\u05E0\u05D9\u05E7\u05D4"), coach.channels.weeklyClinic && /*#__PURE__*/React.createElement("span", {
    className: "bg-[#f0e4dc] text-[#7c533c] text-sm px-3 py-1 rounded-full font-medium"
  }, "\u2713 \u05E7\u05DC\u05D9\u05E0\u05D9\u05E7\u05EA \u05D0\u05DE\u05D4\u05D5\u05EA \u05E9\u05D1\u05D5\u05E2\u05D9\u05EA"), coach.channels.online && /*#__PURE__*/React.createElement("span", {
    className: "bg-[#f0e4dc] text-[#7c533c] text-sm px-3 py-1 rounded-full font-medium"
  }, "\u2713 \u05D0\u05D5\u05E0\u05DC\u05D9\u05D9\u05DF"), HEALTH_FUNDS.map(([k, l]) => coach.channels[k] && /*#__PURE__*/React.createElement("span", {
    key: k,
    className: "bg-[#fbe6e0] text-[#8f4d3f] text-sm px-3 py-1 rounded-full font-medium"
  }, k === 'tipatChalav' ? '🍼 טיפת חלב' : 'קופ״ח ' + l))), coach.additionalFields && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-4 border-t border-[#fdf0e6]"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-bold tracking-wider text-[#a25a62] mb-2"
  }, "\u05EA\u05D7\u05D5\u05DE\u05D9 \u05D8\u05D9\u05E4\u05D5\u05DC \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD \u05D5\u05D4\u05EA\u05DE\u05D7\u05D5\u05D9\u05D5\u05EA:"), /*#__PURE__*/React.createElement("p", {
    className: "text-base text-[#7c533c] leading-relaxed whitespace-pre-line"
  }, coach.additionalFields))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#fdf0e6]"
  }, /*#__PURE__*/React.createElement("a", {
    href: getWhatsAppLink(coach.phone, coach.name),
    target: "_blank",
    rel: "noopener noreferrer",
    className: "bg-[#e8b4b8] hover:bg-[#e2a3a8] text-[#5a3a28] py-3 rounded-2xl font-medium text-base flex items-center justify-center gap-2 transition"
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 18
  }), " \u05D5\u05D5\u05D0\u05D8\u05E1\u05D0\u05E4", /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, " \u05DC", coach.name, " (\u05E0\u05E4\u05EA\u05D7 \u05D1\u05D7\u05DC\u05D5\u05DF \u05D7\u05D3\u05E9)")), /*#__PURE__*/React.createElement("a", {
    href: `tel:${coach.phone}`,
    className: "border-2 border-[#f3e1d3] hover:bg-[#fcf1e8] text-[#7c533c] py-3 rounded-2xl font-medium text-base flex items-center justify-center gap-2 transition"
  }, /*#__PURE__*/React.createElement(Phone, {
    size: 18
  }), " \u05E9\u05D9\u05D7\u05D4", /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, " \u05E2\u05DD ", coach.name)))))))), view === 'register' && !consultantUnlocked && /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    className: "max-w-md mx-auto px-6 py-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-8 shadow-sm border border-[#f3e1d3] text-center"
  }, /*#__PURE__*/React.createElement(Lock, {
    size: 40,
    className: "mx-auto text-[#a25a62] mb-4"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold text-[#7c533c] mb-1"
  }, "\u05DB\u05E0\u05D9\u05E1\u05D4 \u05DC\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D4\u05E0\u05E7\u05D4"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#8a5c47] mb-6"
  }, "\u05D4\u05D6\u05D9\u05E0\u05D9 \u05D0\u05EA \u05E7\u05D5\u05D3 \u05D4\u05D2\u05D9\u05E9\u05D4 \u05DB\u05D3\u05D9 \u05DC\u05DE\u05DC\u05D0 \u05D0\u05EA \u05D8\u05D5\u05E4\u05E1 \u05D4\u05D4\u05E6\u05D8\u05E8\u05E4\u05D5\u05EA."), /*#__PURE__*/React.createElement("label", {
    htmlFor: "reg-code",
    className: "sr-only"
  }, "\u05E7\u05D5\u05D3 \u05D2\u05D9\u05E9\u05D4 \u05DC\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA"), /*#__PURE__*/React.createElement("input", {
    id: "reg-code",
    type: "password",
    value: regCode,
    autoFocus: true,
    onChange: e => {
      setRegCode(e.target.value);
      setRegError(false);
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        regCode === CONSULTANT_CODE ? setConsultantUnlocked(true) : setRegError(true);
      }
    },
    className: INPUT + " text-center tracking-widest",
    placeholder: "\u2022 \u2022 \u2022 \u2022"
  }), regError && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#b8332b] mt-2"
  }, "\u05E7\u05D5\u05D3 \u05E9\u05D2\u05D5\u05D9, \u05E0\u05E1\u05D9 \u05E9\u05D5\u05D1."), /*#__PURE__*/React.createElement("button", {
    onClick: () => regCode === CONSULTANT_CODE ? setConsultantUnlocked(true) : setRegError(true),
    className: "w-full mt-4 bg-[#e8b4b8] hover:bg-[#e2a3a8] text-[#5a3a28] font-bold py-3 rounded-xl transition"
  }, "\u05DB\u05E0\u05D9\u05E1\u05D4"), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 pt-6 border-t border-[#f3e1d3]"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-4"
  }, "\u05D0\u05DD \u05D0\u05EA \u05D9\u05D5\u05E2\u05E6\u05EA \u05D4\u05E0\u05E7\u05D4 \u05D5\u05E8\u05D5\u05E6\u05D4 \u05DC\u05D4\u05D5\u05E4\u05D9\u05E2 \u05D1\u05D0\u05EA\u05E8, \u05E4\u05E0\u05D9 \u05DC\u05D0\u05D1\u05D9\u05D8\u05DC \u05E2\u05E6\u05D9\u05D5\u05DF \u05D1\u05D5\u05D5\u05D0\u05D8\u05E1\u05D0\u05E4 \u05DB\u05D3\u05D9 \u05DC\u05E7\u05D1\u05DC \u05E7\u05D5\u05D3 \u05D2\u05D9\u05E9\u05D4."), /*#__PURE__*/React.createElement("a", {
    href: `https://wa.me/${AVITAL_WHATSAPP}?text=${encodeURIComponent('היי אביטל, אני יועצת הנקה ואשמח לקבל קוד גישה כדי להופיע באתר 🌸')}`,
    target: "_blank",
    rel: "noreferrer",
    className: "inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-[#0b2e1a] font-bold px-5 py-3 rounded-xl transition shadow-sm"
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 18
  }), " \u05E4\u05E0\u05D9\u05D9\u05D4 \u05DC\u05D0\u05D1\u05D9\u05D8\u05DC \u05D1\u05D5\u05D5\u05D0\u05D8\u05E1\u05D0\u05E4", /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, " (\u05E0\u05E4\u05EA\u05D7 \u05D1\u05D7\u05DC\u05D5\u05DF \u05D7\u05D3\u05E9)"))))), view === 'register' && consultantUnlocked && /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    className: "max-w-2xl mx-auto px-6 py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#f3e1d3]"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-bold text-[#7c533c] mb-2"
  }, "\u05D4\u05E6\u05D8\u05E8\u05E4\u05D9 \u05DC\u05E7\u05D4\u05D9\u05DC\u05EA \u05D4\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#8a5c47] mb-8"
  }, "\u05DE\u05DC\u05D0\u05D9 \u05D0\u05EA \u05E4\u05E8\u05D8\u05D9\u05D9\u05DA \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05D9\u05DD. \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05D9\u05E2\u05D1\u05E8\u05D5 \u05DC\u05D0\u05D9\u05E9\u05D5\u05E8 \u05E9\u05DC \u05D0\u05D1\u05D9\u05D8\u05DC \u05DC\u05E4\u05E0\u05D9 \u05D4\u05E4\u05E8\u05E1\u05D5\u05DD \u05D1\u05D3\u05E3 \u05D4\u05D1\u05D9\u05EA."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u05E9\u05DD \u05DE\u05DC\u05D0"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    }),
    className: INPUT,
    placeholder: "\u05DC\u05D3\u05D5\u05D2\u05DE\u05D4: \u05D0\u05D1\u05D9\u05D8\u05DC \u05E2\u05E6\u05D9\u05D5\u05DF"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05EA\u05D0\u05E8\u05D9\u05DD \u05D5\u05D4\u05E1\u05DE\u05DB\u05D5\u05EA \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: form.credentials,
    onChange: e => setForm({
      ...form,
      credentials: e.target.value
    }),
    className: INPUT,
    placeholder: "\u05DB\u05EA\u05D1\u05D9 \u05DB\u05D0\u05DF \u05D0\u05EA \u05D4\u05D4\u05E1\u05DE\u05DB\u05D5\u05EA \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05D5\u05EA \u05E9\u05DC\u05DA..."
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05D4\u05D2\u05D9\u05E9\u05D4 \u05E9\u05DC\u05D9 (\u05D4\u05DE\u05E9\u05E4\u05D8 \u05E9\u05DE\u05D7\u05D1\u05E8 \u05D0\u05D5\u05EA\u05DA \u05DC\u05D0\u05DE\u05D0)"
  }, /*#__PURE__*/React.createElement("textarea", {
    required: true,
    rows: 2,
    value: form.statement,
    onChange: e => setForm({
      ...form,
      statement: e.target.value
    }),
    className: INPUT,
    placeholder: "\u05DE\u05E9\u05E4\u05D8 \u05E7\u05E6\u05E8 \u05E9\u05E4\u05D5\u05E0\u05D4 \u05DC\u05D0\u05DE\u05D0 \u05D1\u05D2\u05D5\u05D1\u05D4 \u05D4\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u05D0\u05D6\u05D5\u05E8 \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: form.location,
    onChange: e => setForm({
      ...form,
      location: e.target.value
    }),
    className: INPUT
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05D8\u05DC\u05E4\u05D5\u05DF (\u05D5\u05D5\u05D0\u05D8\u05E1\u05D0\u05E4 \u05D5\u05E9\u05D9\u05D7\u05D5\u05EA)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "tel",
    required: true,
    value: form.phone,
    onChange: e => setForm({
      ...form,
      phone: e.target.value
    }),
    className: INPUT,
    placeholder: "054XXXXXXX"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-semibold mb-3"
  }, "\u05D0\u05D9\u05DA \u05E0\u05D9\u05EA\u05DF \u05DC\u05E7\u05D1\u05DC \u05D0\u05E6\u05DC\u05DA \u05E9\u05D9\u05E8\u05D5\u05EA? (\u05E1\u05DE\u05E0\u05D9 \u05D0\u05EA \u05DB\u05DC \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, [['homeVisit', 'ביקורי בית'], ['clinic', 'טיפול בקליניקה'], ['weeklyClinic', 'קליניקת אמהות שבועית'], ['online', 'אונליין / מרחוק']].map(([key, label]) => /*#__PURE__*/React.createElement("label", {
    key: key,
    className: "flex items-center gap-3 p-3 border border-[#f3e1d3] rounded-xl cursor-pointer bg-[#fdfaf6] hover:bg-white select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: form[key],
    onChange: e => setForm({
      ...form,
      [key]: e.target.checked
    }),
    className: "accent-[#e8b4b8] w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-semibold mb-3"
  }, "\u05DE\u05E7\u05D1\u05DC\u05EA \u05D3\u05E8\u05DA \u05E7\u05D5\u05E4\u05EA \u05D7\u05D5\u05DC\u05D9\u05DD / \u05D8\u05D9\u05E4\u05EA \u05D7\u05DC\u05D1? (\u05E1\u05DE\u05E0\u05D9 \u05D0\u05EA \u05DB\u05DC \u05D4\u05DE\u05EA\u05D0\u05D9\u05DD)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-3"
  }, HEALTH_FUNDS.map(([key, label]) => /*#__PURE__*/React.createElement("label", {
    key: key,
    className: "flex items-center gap-3 p-3 border border-[#f3e1d3] rounded-xl cursor-pointer bg-[#fdfaf6] hover:bg-white select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: form[key],
    onChange: e => setForm({
      ...form,
      [key]: e.target.checked
    }),
    className: "accent-[#e8b4b8] w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, label))))), /*#__PURE__*/React.createElement(Field, {
    label: "\u05EA\u05D7\u05D5\u05DE\u05D9 \u05D8\u05D9\u05E4\u05D5\u05DC \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD \u05D5\u05D4\u05EA\u05DE\u05D7\u05D5\u05D9\u05D5\u05EA \u05DE\u05D9\u05D5\u05D7\u05D3\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    value: form.additionalFields,
    onChange: e => setForm({
      ...form,
      additionalFields: e.target.value
    }),
    className: INPUT,
    placeholder: "\u05DB\u05EA\u05D1\u05D9 \u05DB\u05D0\u05DF \u05D1\u05D7\u05D5\u05E4\u05E9\u05D9\u05D5\u05EA \u05E2\u05DC \u05D4\u05D4\u05DB\u05E9\u05E8\u05D5\u05EA, \u05D4\u05DB\u05DC\u05D9\u05DD \u05D5\u05D4\u05DE\u05D9\u05D5\u05DE\u05E0\u05D5\u05D9\u05D5\u05EA \u05D4\u05E0\u05D5\u05E1\u05E4\u05D5\u05EA \u05E9\u05D0\u05EA \u05DE\u05D1\u05D9\u05D0\u05D4 \u05D0\u05D9\u05EA\u05DA..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-[#f3e1d3]"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-[#7c533c] mb-1"
  }, "\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05E9\u05DC\u05DA (\u05DC\u05D0 \u05D7\u05D5\u05D1\u05D4)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#8a5c47] mb-4"
  }, "\u05D4\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05E9\u05EA\u05DE\u05DC\u05D0\u05D9 \u05D9\u05D5\u05E4\u05D9\u05E2\u05D5 \u05DB\u05D0\u05D9\u05D9\u05E7\u05D5\u05E0\u05D9\u05DD \u05DC\u05D7\u05D9\u05E6\u05D9\u05DD \u05D1\u05DB\u05E8\u05D8\u05D9\u05E1 \u05D4\u05E4\u05E8\u05D5\u05E4\u05D9\u05DC \u05E9\u05DC\u05DA \u05D1\u05D0\u05EA\u05E8."), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u05E7\u05D9\u05E9\u05D5\u05E8 \u05DC\u05D0\u05D9\u05E0\u05E1\u05D8\u05D2\u05E8\u05DD"
  }, /*#__PURE__*/React.createElement("input", {
    type: "url",
    value: form.instagram,
    onChange: e => setForm({
      ...form,
      instagram: e.target.value
    }),
    className: INPUT,
    placeholder: "https://instagram.com/your_name"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05E7\u05D9\u05E9\u05D5\u05E8 \u05DC\u05E4\u05D9\u05D9\u05E1\u05D1\u05D5\u05E7"
  }, /*#__PURE__*/React.createElement("input", {
    type: "url",
    value: form.facebook,
    onChange: e => setForm({
      ...form,
      facebook: e.target.value
    }),
    className: INPUT,
    placeholder: "https://facebook.com/your_page"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05E7\u05D9\u05E9\u05D5\u05E8 \u05DC\u05D0\u05EA\u05E8 \u05D4\u05D0\u05D9\u05E9\u05D9 \u05E9\u05DC\u05DA"
  }, /*#__PURE__*/React.createElement("input", {
    type: "url",
    value: form.website,
    onChange: e => setForm({
      ...form,
      website: e.target.value
    }),
    className: INPUT,
    placeholder: "https://your-website.co.il"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-semibold mb-2"
  }, "\u05EA\u05DE\u05D5\u05E0\u05EA \u05E4\u05E8\u05D5\u05E4\u05D9\u05DC (\u05DC\u05D0 \u05D7\u05D5\u05D1\u05D4 \u2014 \u05D0\u05D1\u05D9\u05D8\u05DC \u05EA\u05D5\u05DB\u05DC \u05DC\u05D4\u05D7\u05DC\u05D9\u05E3 \u05DC\u05E4\u05E0\u05D9 \u05D4\u05E4\u05E8\u05E1\u05D5\u05DD)"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: form.image,
    name: form.name,
    className: "w-16 h-16 rounded-full border border-[#f3e1d3] flex-shrink-0"
  }), /*#__PURE__*/React.createElement("label", {
    className: "cursor-pointer text-sm bg-[#fdfaf6] border border-[#f3e1d3] px-4 py-2 rounded-xl hover:bg-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 16
  }), " \u05D1\u05D7\u05D9\u05E8\u05EA \u05EA\u05DE\u05D5\u05E0\u05D4", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    className: "hidden",
    onChange: e => readImage(e.target.files[0], img => setForm({
      ...form,
      image: img
    }))
  })))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#8a5c47] bg-[#fdf8f4] border border-[#f3e1d3] p-3 rounded-xl leading-relaxed text-center"
  }, "\u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05E9\u05EA\u05DE\u05DC\u05D0\u05D9 \u05E0\u05E9\u05DE\u05E8\u05D9\u05DD \u05DC\u05E6\u05D5\u05E8\u05DA \u05D4\u05E6\u05D2\u05EA\u05DA \u05D1\u05DE\u05D0\u05D2\u05E8 \u05D1\u05DC\u05D1\u05D3, \u05D5\u05DC\u05D0 \u05D9\u05D5\u05E2\u05D1\u05E8\u05D5 \u05DC\u05D2\u05D5\u05E8\u05DD \u05E9\u05DC\u05D9\u05E9\u05D9. \u05DC\u05D4\u05E1\u05E8\u05D4 \u05D0\u05D5 \u05E2\u05D3\u05DB\u05D5\u05DF \u05D1\u05DB\u05DC \u05E2\u05EA \u05E0\u05D9\u05EA\u05DF \u05DC\u05E4\u05E0\u05D5\u05EA \u05DC\u05D0\u05D1\u05D9\u05D8\u05DC."), /*#__PURE__*/React.createElement("label", {
    className: "flex items-start gap-3 p-3 border border-[#f3e1d3] rounded-xl bg-[#fdfaf6] cursor-pointer select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: agreed,
    onChange: e => setAgreed(e.target.checked),
    className: "accent-[#e8b4b8] w-5 h-5 mt-0.5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-[#7c533c] leading-relaxed"
  }, "\u05E7\u05E8\u05D0\u05EA\u05D9 \u05D5\u05D0\u05E0\u05D9 \u05DE\u05D0\u05E9\u05E8\u05EA \u05D0\u05EA ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPrivacy(true),
    className: "underline text-[#a25a62]"
  }, "\u05DE\u05D3\u05D9\u05E0\u05D9\u05D5\u05EA \u05D4\u05E4\u05E8\u05D8\u05D9\u05D5\u05EA"), ", \u05D5\u05DE\u05E1\u05DB\u05D9\u05DE\u05D4 \u05DC\u05D4\u05D9\u05DB\u05DC\u05DC \u05D1\u05E8\u05E9\u05D9\u05DE\u05EA \u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D4\u05D4\u05E0\u05E7\u05D4 \u05E9\u05DC \u05D0\u05D9\u05DC\u05EA.")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: saving || !agreed,
    className: "w-full bg-[#e8b4b8] hover:bg-[#e2a3a8] disabled:opacity-60 disabled:cursor-not-allowed text-[#5a3a28] font-bold py-4 rounded-xl shadow-sm transition"
  }, saving ? 'שולח…' : 'שליחת פרטים לאישור')))), view === 'admin' && !adminUnlocked && /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    className: "max-w-sm mx-auto px-6 py-20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-8 shadow-sm border border-[#f3e1d3] text-center"
  }, /*#__PURE__*/React.createElement(Lock, {
    size: 40,
    className: "mx-auto text-[#a25a62] mb-4"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-[#7c533c] mb-1"
  }, "\u05D0\u05D6\u05D5\u05E8 \u05E0\u05D9\u05D4\u05D5\u05DC"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#8a5c47] mb-6"
  }, "\u05D4\u05D6\u05D9\u05E0\u05D9 \u05D0\u05EA \u05E7\u05D5\u05D3 \u05D4\u05DB\u05E0\u05D9\u05E1\u05D4."), /*#__PURE__*/React.createElement("label", {
    htmlFor: "admin-code",
    className: "sr-only"
  }, "\u05E7\u05D5\u05D3 \u05DB\u05E0\u05D9\u05E1\u05D4 \u05DC\u05D0\u05D6\u05D5\u05E8 \u05D4\u05E0\u05D9\u05D4\u05D5\u05DC"), /*#__PURE__*/React.createElement("input", {
    id: "admin-code",
    type: "password",
    value: codeInput,
    autoFocus: true,
    onChange: e => {
      setCodeInput(e.target.value);
      setCodeError(false);
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        codeInput === ADMIN_CODE ? setAdminUnlocked(true) : setCodeError(true);
      }
    },
    className: INPUT + " text-center tracking-widest",
    placeholder: "\u2022 \u2022 \u2022 \u2022"
  }), codeError && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#b8332b] mt-2"
  }, "\u05E7\u05D5\u05D3 \u05E9\u05D2\u05D5\u05D9, \u05E0\u05E1\u05D9 \u05E9\u05D5\u05D1."), /*#__PURE__*/React.createElement("button", {
    onClick: () => codeInput === ADMIN_CODE ? setAdminUnlocked(true) : setCodeError(true),
    className: "w-full mt-4 bg-[#e8b4b8] hover:bg-[#e2a3a8] text-[#5a3a28] font-bold py-3 rounded-xl transition"
  }, "\u05DB\u05E0\u05D9\u05E1\u05D4"))), view === 'admin' && adminUnlocked && /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    className: "max-w-4xl mx-auto px-6 py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-3 justify-between items-center mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-bold text-[#7c533c]"
  }, "\u05E4\u05D0\u05E0\u05DC \u05E0\u05D9\u05D4\u05D5\u05DC"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#8a5c47]"
  }, "\u05E2\u05E8\u05D9\u05DB\u05D4 \u05D5\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D1\u05E7\u05E9\u05D5\u05EA, \u05E2\u05E8\u05D9\u05DB\u05EA \u05E4\u05E8\u05D8\u05D9 \u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D5\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA, \u05D5\u05E0\u05D9\u05D4\u05D5\u05DC \u05D4\u05D0\u05EA\u05E8.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#f0e4dc] text-[#7c533c] px-4 py-2 rounded-xl text-sm font-bold"
  }, "\u05D1\u05E7\u05E9\u05D5\u05EA \u05D4\u05DE\u05DE\u05EA\u05D9\u05E0\u05D5\u05EA \u05DC\u05D0\u05D9\u05E9\u05D5\u05E8: ", pending.length)), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-[#7c533c] mb-4"
  }, "\u05D1\u05E7\u05E9\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA"), pending.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-10 text-center border border-[#f3e1d3] text-[#8a5c47] mb-12"
  }, /*#__PURE__*/React.createElement(Check, {
    size: 44,
    className: "mx-auto text-[#f4a284] mb-3"
  }), /*#__PURE__*/React.createElement("p", {
    className: "font-medium"
  }, "\u05D0\u05D9\u05DF \u05D1\u05E7\u05E9\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA \u05DB\u05E8\u05D2\u05E2."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-1"
  }, "\u05DB\u05E9\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D9\u05E8\u05E9\u05DE\u05D5 \u05D1\u05D8\u05D5\u05E4\u05E1, \u05D4\u05DF \u05D9\u05D5\u05E4\u05D9\u05E2\u05D5 \u05DB\u05D0\u05DF.")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 mb-12"
  }, pending.map(p => /*#__PURE__*/React.createElement(PendingCard, {
    key: p.id,
    pending: p,
    onApprove: approve,
    onReject: reject
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-[#7c533c] mb-4"
  }, "\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05DE\u05E4\u05D5\u05E8\u05E1\u05DE\u05D5\u05EA \u05D1\u05D0\u05EA\u05E8 (", consultants.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, consultants.map(c => /*#__PURE__*/React.createElement(ConsultantRow, {
    key: c.id,
    consultant: c,
    onUpdate: updateConsultant,
    onRemove: removeConsultant
  })))), /*#__PURE__*/React.createElement("footer", {
    className: "text-center py-10 border-t border-[#f3e1d3] mt-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-3"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 52
  })), /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-[#7c533c] mb-3"
  }, "\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D4\u05D4\u05E0\u05E7\u05D4 \u05E9\u05DC \u05D0\u05D9\u05DC\u05EA"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowPrivacy(true),
    className: "text-xs text-[#8a5c47] underline hover:text-[#a25a62] py-2"
  }, "\u05D4\u05E6\u05D4\u05E8\u05EA \u05E4\u05E8\u05D8\u05D9\u05D5\u05EA"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.dispatchEvent(new CustomEvent('open-a11y-statement')),
    className: "text-xs text-[#8a5c47] underline hover:text-[#a25a62] py-2"
  }, "\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#8a5c47]"
  }, "\u05E0\u05D1\u05E0\u05D4 \u05D1\u05D0\u05D4\u05D1\u05D4 \u05E2\u05DC \u05D9\u05D3\u05D9 ", /*#__PURE__*/React.createElement("a", {
    href: "https://avitaletzion.com",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-[#a25a62] font-medium underline hover:text-[#a25a62]"
  }, "\u05D0\u05D1\u05D9\u05D8\u05DC \u05E2\u05E6\u05D9\u05D5\u05DF", /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, " (\u05E0\u05E4\u05EA\u05D7 \u05D1\u05D7\u05DC\u05D5\u05DF \u05D7\u05D3\u05E9)")), " \uD83D\uDC9C")), showPrivacy && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-[70]",
    onClick: () => setShowPrivacy(false)
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "privacy-title",
    tabIndex: -1,
    ref: el => el && el.focus(),
    onKeyDown: e => {
      if (e.key === 'Escape') setShowPrivacy(false);
    },
    className: "bg-white rounded-2xl p-6 max-w-md w-full text-right max-h-[85vh] overflow-y-auto",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("h3", {
    id: "privacy-title",
    className: "text-xl font-bold text-[#7c533c] mb-3"
  }, "\u05D4\u05E6\u05D4\u05E8\u05EA \u05E4\u05E8\u05D8\u05D9\u05D5\u05EA"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, "\u05D0\u05EA\u05E8 \"\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D4\u05D4\u05E0\u05E7\u05D4 \u05E9\u05DC \u05D0\u05D9\u05DC\u05EA\" \u05D4\u05D5\u05D0 \u05DE\u05D0\u05D2\u05E8 \u05D4\u05DE\u05E8\u05DB\u05D6 \u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05D5\u05DE\u05D3\u05E8\u05D9\u05DB\u05D5\u05EA \u05D4\u05E0\u05E7\u05D4 \u05D1\u05D0\u05D9\u05DC\u05EA \u05D5\u05D1\u05E1\u05D1\u05D9\u05D1\u05D4."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "\u05D0\u05D9\u05DC\u05D5 \u05E4\u05E8\u05D8\u05D9\u05DD \u05E0\u05D0\u05E1\u05E4\u05D9\u05DD?"), " \u05D9\u05D5\u05E2\u05E6\u05EA \u05D4\u05DE\u05D1\u05E7\u05E9\u05EA \u05DC\u05D4\u05D5\u05E4\u05D9\u05E2 \u05D1\u05DE\u05D0\u05D2\u05E8 \u05DE\u05DE\u05DC\u05D0\u05EA \u05D1\u05E2\u05E6\u05DE\u05D4 \u05D0\u05EA \u05E4\u05E8\u05D8\u05D9\u05D4 \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05D9\u05DD (\u05E9\u05DD, \u05EA\u05D0\u05E8\u05D9\u05DD, \u05D0\u05D6\u05D5\u05E8 \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA, \u05D8\u05DC\u05E4\u05D5\u05DF, \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05DC\u05E8\u05E9\u05EA\u05D5\u05EA \u05D5\u05EA\u05DE\u05D5\u05E0\u05D4). \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05E0\u05D0\u05E1\u05E4\u05D9\u05DD \u05D0\u05DA \u05D5\u05E8\u05E7 \u05DC\u05E6\u05D5\u05E8\u05DA \u05D4\u05E6\u05D2\u05EA\u05D4 \u05D1\u05DE\u05D0\u05D2\u05E8."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "\u05E9\u05D9\u05DE\u05D5\u05E9 \u05D5\u05E9\u05D9\u05EA\u05D5\u05E3:"), " \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05DE\u05D5\u05E6\u05D2\u05D9\u05DD \u05D1\u05D3\u05E3 \u05D4\u05E6\u05D9\u05D1\u05D5\u05E8\u05D9 \u05DB\u05D3\u05D9 \u05DC\u05D0\u05E4\u05E9\u05E8 \u05DC\u05D0\u05DE\u05D4\u05D5\u05EA \u05DC\u05D9\u05E6\u05D5\u05E8 \u05E7\u05E9\u05E8 \u05D9\u05E9\u05D9\u05E8 \u05E2\u05DD \u05D4\u05D9\u05D5\u05E2\u05E6\u05EA. \u05D0\u05D9\u05E0\u05E0\u05D5 \u05DE\u05E2\u05D1\u05D9\u05E8\u05D9\u05DD \u05D0\u05EA \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05DC\u05D2\u05D5\u05E8\u05DD \u05E9\u05DC\u05D9\u05E9\u05D9 \u05D5\u05D0\u05D9\u05E0\u05E0\u05D5 \u05E2\u05D5\u05E9\u05D9\u05DD \u05D1\u05D4\u05DD \u05DB\u05DC \u05E9\u05D9\u05DE\u05D5\u05E9 \u05DE\u05E1\u05D7\u05E8\u05D9."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "\u05DE\u05D1\u05E7\u05E8\u05D5\u05EA \u05D1\u05D0\u05EA\u05E8:"), " \u05D4\u05D0\u05EA\u05E8 \u05D0\u05D9\u05E0\u05D5 \u05D0\u05D5\u05E1\u05E3 \u05DE\u05D9\u05D3\u05E2 \u05D0\u05D9\u05E9\u05D9 \u05DE\u05DE\u05D1\u05E7\u05E8\u05D5\u05EA \u05D5\u05D0\u05D9\u05E0\u05D5 \u05DE\u05E9\u05EA\u05DE\u05E9 \u05D1\u05E2\u05D5\u05D2\u05D9\u05D5\u05EA \u05DE\u05E2\u05E7\u05D1 \u05D0\u05D5 \u05D1\u05DB\u05DC\u05D9 \u05D0\u05E0\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-4"
  }, /*#__PURE__*/React.createElement("strong", null, "\u05D4\u05E1\u05E8\u05D4 \u05D5\u05E2\u05D3\u05DB\u05D5\u05DF:"), " \u05E0\u05D9\u05EA\u05DF \u05DC\u05D1\u05E7\u05E9 \u05D4\u05E1\u05E8\u05D4 \u05D0\u05D5 \u05E2\u05D3\u05DB\u05D5\u05DF \u05E9\u05DC \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05D1\u05DB\u05DC \u05E2\u05EA, \u05D1\u05E4\u05E0\u05D9\u05D9\u05D4 \u05DC\u05D0\u05D1\u05D9\u05D8\u05DC \u05E2\u05E6\u05D9\u05D5\u05DF: ", /*#__PURE__*/React.createElement("a", {
    className: "underline text-[#a25a62]",
    href: "mailto:avital.mpt.ibclc@gmail.com"
  }, "avital.mpt.ibclc@gmail.com")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowPrivacy(false),
    className: "w-full bg-[#e8b4b8] hover:bg-[#e2a3a8] text-[#5a3a28] font-bold py-3 rounded-xl"
  }, "\u05E1\u05D2\u05D9\u05E8\u05D4"))), /*#__PURE__*/React.createElement(AccessibilityWidget, null));
}

/* ====== רכיבי עזר ====== */
const INPUT = "w-full px-4 py-3 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] focus:outline-none focus:border-[#e8b4b8]";
/* נגישות: התווית מקושרת אוטומטית לשדה שבתוכה (htmlFor + id) */
const Field = ({
  label,
  children
}) => {
  const id = React.useId();
  const kids = React.Children.map(children, (ch, i) => i === 0 && React.isValidElement(ch) ? React.cloneElement(ch, {
    id: ch.props.id || id
  }) : ch);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    className: "block text-sm font-semibold mb-2"
  }, label), kids);
};

/* כפתורי רשתות של היועצת — מוצגים בכרטיס הפרופיל בדף הבית */
function ConsultantSocial({
  coach
}) {
  const items = [[coach.instagram, Instagram, 'אינסטגרם'], [coach.facebook, Facebook, 'פייסבוק'], [coach.website, Globe, 'אתר אינטרנט']].filter(([url]) => url);
  if (!items.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-3"
  }, items.map(([url, IconC, label], i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: normalizeUrl(url),
    target: "_blank",
    rel: "noopener noreferrer",
    title: label,
    "aria-label": label + ' של ' + coach.name + ' (נפתח בחלון חדש)',
    className: "w-9 h-9 rounded-full bg-[#fdfaf6] border border-[#f3e1d3] text-[#a25a62] hover:bg-[#e8b4b8] hover:text-[#5a3a28] hover:border-[#e8b4b8] flex items-center justify-center transition"
  }, /*#__PURE__*/React.createElement(IconC, {
    size: 17
  }))));
}

/* טופס עריכה משותף — לעריכת כל הפרטים (טקסט + תמונה) ע"י המנהלת */
function EditableFields({
  data,
  set
}) {
  const channels = data.channels || {};
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: data.image,
    name: data.name,
    className: "w-20 h-20 rounded-full border-2 border-[#e8b4b8] flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "cursor-pointer text-sm bg-[#fdfaf6] border border-[#f3e1d3] px-4 py-2 rounded-xl hover:bg-white flex items-center gap-2 w-max"
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 16
  }), " ", data.image ? 'החלפת תמונה' : 'העלאת תמונה', /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    className: "hidden",
    onChange: e => readImage(e.target.files[0], img => set({
      image: img
    }))
  })), data.image && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => set({
      image: null
    }),
    className: "text-xs text-[#a25a62] hover:underline mt-2 mr-1"
  }, "\u05D4\u05E1\u05E8\u05EA \u05EA\u05DE\u05D5\u05E0\u05D4"))), /*#__PURE__*/React.createElement(Field, {
    label: "\u05E9\u05DD \u05DE\u05DC\u05D0"
  }, /*#__PURE__*/React.createElement("input", {
    className: INPUT,
    value: data.name || '',
    onChange: e => set({
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05EA\u05D0\u05E8\u05D9\u05DD \u05D5\u05D4\u05E1\u05DE\u05DB\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement("input", {
    className: INPUT,
    value: data.credentials || '',
    onChange: e => set({
      credentials: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05D4\u05D2\u05D9\u05E9\u05D4 (\u05D4\u05DE\u05E9\u05E4\u05D8 \u05D4\u05D0\u05D9\u05E9\u05D9)"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    className: INPUT,
    value: data.statement || '',
    onChange: e => set({
      statement: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u05D0\u05D6\u05D5\u05E8 \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement("input", {
    className: INPUT,
    value: data.location || '',
    onChange: e => set({
      location: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05D8\u05DC\u05E4\u05D5\u05DF"
  }, /*#__PURE__*/React.createElement("input", {
    className: INPUT,
    value: data.phone || '',
    onChange: e => set({
      phone: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-semibold mb-2"
  }, "\u05E2\u05E8\u05D5\u05E6\u05D9 \u05E9\u05D9\u05E8\u05D5\u05EA"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, [['homeVisit', 'ביקורי בית'], ['clinic', 'טיפול בקליניקה'], ['weeklyClinic', 'קליניקת אמהות שבועית'], ['online', 'אונליין / מרחוק']].map(([k, l]) => /*#__PURE__*/React.createElement("label", {
    key: k,
    className: "flex items-center gap-2 p-2.5 border border-[#f3e1d3] rounded-lg cursor-pointer bg-[#fdfaf6] text-sm select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!channels[k],
    onChange: e => set({
      channels: {
        ...channels,
        [k]: e.target.checked
      }
    }),
    className: "accent-[#e8b4b8] w-4 h-4"
  }), l)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-semibold mb-2"
  }, "\u05E7\u05D5\u05E4\u05D5\u05EA \u05D7\u05D5\u05DC\u05D9\u05DD / \u05D8\u05D9\u05E4\u05EA \u05D7\u05DC\u05D1"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, HEALTH_FUNDS.map(([k, l]) => /*#__PURE__*/React.createElement("label", {
    key: k,
    className: "flex items-center gap-2 p-2.5 border border-[#f3e1d3] rounded-lg cursor-pointer bg-[#fdfaf6] text-sm select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!channels[k],
    onChange: e => set({
      channels: {
        ...channels,
        [k]: e.target.checked
      }
    }),
    className: "accent-[#e8b4b8] w-4 h-4"
  }), l)))), /*#__PURE__*/React.createElement(Field, {
    label: "\u05EA\u05D7\u05D5\u05DE\u05D9 \u05D8\u05D9\u05E4\u05D5\u05DC \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD \u05D5\u05D4\u05EA\u05DE\u05D7\u05D5\u05D9\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    className: INPUT,
    value: data.additionalFields || '',
    onChange: e => set({
      additionalFields: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u05D0\u05D9\u05E0\u05E1\u05D8\u05D2\u05E8\u05DD"
  }, /*#__PURE__*/React.createElement("input", {
    className: INPUT,
    value: data.instagram || '',
    onChange: e => set({
      instagram: e.target.value
    }),
    placeholder: "https://instagram.com/..."
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05E4\u05D9\u05D9\u05E1\u05D1\u05D5\u05E7"
  }, /*#__PURE__*/React.createElement("input", {
    className: INPUT,
    value: data.facebook || '',
    onChange: e => set({
      facebook: e.target.value
    }),
    placeholder: "https://facebook.com/..."
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u05D0\u05EA\u05E8 \u05D0\u05D9\u05E9\u05D9"
  }, /*#__PURE__*/React.createElement("input", {
    className: INPUT,
    value: data.website || '',
    onChange: e => set({
      website: e.target.value
    }),
    placeholder: "https://..."
  }))));
}

/* ====== תוסף נגישות (ת"י 5568 רמה AA — ראו ACCESSIBILITY.md) ======
   מתגים: גודל טקסט · ניגודיות גבוהה · הדגשת קישורים · גופן קריא · עצירת אנימציות · איפוס
   ההעדפה נשמרת בדפדפן ונטענת אוטומטית בכל ביקור.
   הצהרת הנגישות נפתחת גם מכאן וגם מהקישור שבתחתית הדף. */
function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState(() => +(localStorage.getItem('a11y_font') || 0));
  const [contrast, setContrast] = useState(() => localStorage.getItem('a11y_contrast') === '1');
  const [links, setLinks] = useState(() => localStorage.getItem('a11y_links') === '1');
  const [readable, setReadable] = useState(() => localStorage.getItem('a11y_readable') === '1');
  const [noMotion, setNoMotion] = useState(() => localStorage.getItem('a11y_motion') === '1');
  const [stmt, setStmt] = useState(false);
  const fabRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const stmtRef = React.useRef(null);
  useEffect(() => {
    const h = document.documentElement;
    h.classList.toggle('a11y-font-1', font === 1);
    h.classList.toggle('a11y-font-2', font === 2);
    h.classList.toggle('a11y-contrast', contrast);
    h.classList.toggle('a11y-links', links);
    h.classList.toggle('a11y-readable', readable);
    h.classList.toggle('a11y-no-motion', noMotion);
    localStorage.setItem('a11y_font', font);
    localStorage.setItem('a11y_contrast', contrast ? '1' : '0');
    localStorage.setItem('a11y_links', links ? '1' : '0');
    localStorage.setItem('a11y_readable', readable ? '1' : '0');
    localStorage.setItem('a11y_motion', noMotion ? '1' : '0');
  }, [font, contrast, links, readable, noMotion]);

  /* פתיחת ההצהרה גם מהקישור שבפוטר */
  useEffect(() => {
    const openStmt = () => setStmt(true);
    window.addEventListener('open-a11y-statement', openStmt);
    return () => window.removeEventListener('open-a11y-statement', openStmt);
  }, []);

  /* Esc סוגר — והפוקוס חוזר לכפתור שממנו נפתח (חובה בת"י 5568) */
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (stmt) setStmt(false);else if (open) {
        setOpen(false);
        if (fabRef.current) fabRef.current.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, stmt]);

  /* העברת הפוקוס אל החלונית שנפתחה */
  useEffect(() => {
    if (open && panelRef.current) panelRef.current.focus();
  }, [open]);
  useEffect(() => {
    if (stmt && stmtRef.current) stmtRef.current.focus();
  }, [stmt]);

  /* כליאת Tab בתוך חלונית ההצהרה, כדי שלא "יברח" לרקע */
  const trapTab = e => {
    if (e.key !== 'Tab' || !stmtRef.current) return;
    const f = stmtRef.current.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0],
      last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  const reset = () => {
    setFont(0);
    setContrast(false);
    setLinks(false);
    setReadable(false);
    setNoMotion(false);
  };
  const Toggle = ({
    on,
    onClick,
    children
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-pressed": on,
    className: `w-full min-h-[44px] text-right px-4 py-2.5 rounded-xl border text-sm font-medium transition flex items-center justify-between ${on ? 'bg-[#e8b4b8] text-[#5a3a28] border-[#e8b4b8]' : 'bg-[#fdfaf6] text-[#7c533c] border-[#f3e1d3] hover:bg-[#fcf1e8]'}`
  }, /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, on ? '✓' : ''));
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-4 left-4 z-[60]"
  }, open && /*#__PURE__*/React.createElement("div", {
    ref: panelRef,
    tabIndex: -1,
    role: "dialog",
    "aria-label": "\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA",
    className: "mb-3 w-64 bg-white rounded-2xl shadow-xl border border-[#f3e1d3] p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-[#7c533c]"
  }, "\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setOpen(false);
      if (fabRef.current) fabRef.current.focus();
    },
    "aria-label": "\u05E1\u05D2\u05D9\u05E8\u05EA \u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA",
    className: "text-[#a25a62] text-2xl leading-none w-11 h-11 flex items-center justify-center"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFont(Math.max(0, font - 1)),
    "aria-label": "\u05D4\u05E7\u05D8\u05E0\u05EA \u05D8\u05E7\u05E1\u05D8",
    className: "flex-1 min-h-[44px] py-2 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] hover:bg-[#fcf1e8] font-bold text-[#7c533c]"
  }, "\u05D0-"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFont(Math.min(2, font + 1)),
    "aria-label": "\u05D4\u05D2\u05D3\u05DC\u05EA \u05D8\u05E7\u05E1\u05D8",
    className: "flex-1 min-h-[44px] py-2 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] hover:bg-[#fcf1e8] font-bold text-[#7c533c]"
  }, "\u05D0+")), /*#__PURE__*/React.createElement(Toggle, {
    on: contrast,
    onClick: () => setContrast(!contrast)
  }, "\u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA \u05D2\u05D1\u05D5\u05D4\u05D4"), /*#__PURE__*/React.createElement(Toggle, {
    on: links,
    onClick: () => setLinks(!links)
  }, "\u05D4\u05D3\u05D2\u05E9\u05EA \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD"), /*#__PURE__*/React.createElement(Toggle, {
    on: readable,
    onClick: () => setReadable(!readable)
  }, "\u05D2\u05D5\u05E4\u05DF \u05E7\u05E8\u05D9\u05D0"), /*#__PURE__*/React.createElement(Toggle, {
    on: noMotion,
    onClick: () => setNoMotion(!noMotion)
  }, "\u05E2\u05E6\u05D9\u05E8\u05EA \u05D0\u05E0\u05D9\u05DE\u05E6\u05D9\u05D5\u05EA"), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    className: "w-full min-h-[44px] py-2 rounded-xl border border-[#f3e1d3] text-[#7c533c] hover:bg-[#fcf1e8] text-sm"
  }, "\u05D0\u05D9\u05E4\u05D5\u05E1"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStmt(true),
    className: "w-full text-xs text-[#8a5c47] underline pt-1 min-h-[44px]"
  }, "\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA"))), /*#__PURE__*/React.createElement("button", {
    ref: fabRef,
    onClick: () => setOpen(!open),
    "aria-expanded": open,
    "aria-haspopup": "dialog",
    "aria-label": open ? 'סגירת תפריט נגישות' : 'פתיחת תפריט נגישות',
    className: "w-14 h-14 rounded-full bg-[#e8b4b8] hover:bg-[#e2a3a8] text-[#5a3a28] shadow-lg flex items-center justify-center border-2 border-white"
  }, /*#__PURE__*/React.createElement(Accessibility, {
    size: 28
  })), stmt && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-[70]",
    onClick: () => setStmt(false)
  }, /*#__PURE__*/React.createElement("div", {
    ref: stmtRef,
    tabIndex: -1,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "a11y-stmt-title",
    onKeyDown: trapTab,
    className: "bg-white rounded-2xl p-6 max-w-md w-full text-right max-h-[85vh] overflow-y-auto",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("h3", {
    id: "a11y-stmt-title",
    className: "text-xl font-bold text-[#7c533c] mb-3"
  }, "\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, "\u05D0\u05E0\u05D5 \u05E8\u05D5\u05D0\u05D9\u05DD \u05D7\u05E9\u05D9\u05D1\u05D5\u05EA \u05E8\u05D1\u05D4 \u05D1\u05D4\u05E0\u05D2\u05E9\u05EA \u05D4\u05D0\u05EA\u05E8 \u05DC\u05DB\u05DC\u05DC \u05D4\u05DE\u05E9\u05EA\u05DE\u05E9\u05D9\u05DD/\u05D5\u05EA. \u05D4\u05D0\u05EA\u05E8 \u05E4\u05D5\u05EA\u05D7 \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05E2\u05E7\u05E8\u05D5\u05E0\u05D5\u05EA \u05D4\u05EA\u05E7\u05DF \u05D4\u05D9\u05E9\u05E8\u05D0\u05DC\u05D9 (\u05EA\"\u05D9 5568) \u05D1\u05E8\u05DE\u05EA AA, \u05D5\u05DB\u05D5\u05DC\u05DC \u05E8\u05DB\u05D9\u05D1 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA: \u05D4\u05D2\u05D3\u05DC\u05EA \u05D8\u05E7\u05E1\u05D8, \u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA \u05D2\u05D1\u05D5\u05D4\u05D4, \u05D4\u05D3\u05D2\u05E9\u05EA \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD, \u05D2\u05D5\u05E4\u05DF \u05E7\u05E8\u05D9\u05D0 \u05D5\u05E2\u05E6\u05D9\u05E8\u05EA \u05D0\u05E0\u05D9\u05DE\u05E6\u05D9\u05D5\u05EA."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, "\u05D1\u05E0\u05D5\u05E1\u05E3 \u05D4\u05D0\u05EA\u05E8 \u05DB\u05D5\u05DC\u05DC: \u05E0\u05D9\u05D5\u05D5\u05D8 \u05DE\u05DC\u05D0 \u05D1\u05DE\u05E7\u05DC\u05D3\u05EA \u05E2\u05DD \u05E1\u05D9\u05DE\u05D5\u05DF \u05E4\u05D5\u05E7\u05D5\u05E1 \u05D1\u05E8\u05D5\u05E8, \u05E7\u05D9\u05E9\u05D5\u05E8 \u05DC\u05D3\u05D9\u05DC\u05D5\u05D2 \u05DC\u05EA\u05D5\u05DB\u05DF \u05D4\u05E8\u05D0\u05E9\u05D9, \u05EA\u05D9\u05D0\u05D5\u05E8\u05D9 \u05D8\u05E7\u05E1\u05D8 \u05DC\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA \u05D5\u05DC\u05DB\u05E4\u05EA\u05D5\u05E8\u05D9\u05DD, \u05EA\u05D5\u05D5\u05D9\u05D5\u05EA \u05DC\u05E9\u05D3\u05D5\u05EA \u05D4\u05D8\u05D5\u05E4\u05E1, \u05D5\u05DE\u05D1\u05E0\u05D4 \u05DB\u05D5\u05EA\u05E8\u05D5\u05EA \u05EA\u05E7\u05D9\u05DF \u05DC\u05E7\u05D5\u05E8\u05D0\u05D9 \u05DE\u05E1\u05DA."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "\u05DE\u05D2\u05D1\u05DC\u05D5\u05EA \u05D9\u05D3\u05D5\u05E2\u05D5\u05EA:"), " \u05EA\u05D5\u05DB\u05DF \u05E9\u05D4\u05E2\u05DC\u05D5 \u05D4\u05D9\u05D5\u05E2\u05E6\u05D5\u05EA \u05E2\u05E6\u05DE\u05DF (\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA \u05E4\u05E8\u05D5\u05E4\u05D9\u05DC \u05D5\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05DC\u05D0\u05EA\u05E8\u05D9\u05DD \u05D5\u05DC\u05E8\u05E9\u05EA\u05D5\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05D5\u05EA) \u05D0\u05D9\u05E0\u05D5 \u05D1\u05E9\u05DC\u05D9\u05D8\u05EA\u05E0\u05D5 \u05D5\u05D9\u05D9\u05EA\u05DB\u05DF \u05E9\u05D0\u05D9\u05E0\u05D5 \u05E0\u05D2\u05D9\u05E9 \u05D1\u05DE\u05DC\u05D5\u05D0\u05D5. \u05D0\u05E0\u05D7\u05E0\u05D5 \u05E4\u05D5\u05E2\u05DC\u05D5\u05EA \u05DC\u05E9\u05E4\u05E8 \u05D6\u05D0\u05EA \u05D1\u05D0\u05D5\u05E4\u05DF \u05E9\u05D5\u05D8\u05E3."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "\u05E8\u05DB\u05D6/\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA:"), " \u05D0\u05D1\u05D9\u05D8\u05DC \u05E2\u05E6\u05D9\u05D5\u05DF \xB7 \u05D8\u05DC\u05E4\u05D5\u05DF ", /*#__PURE__*/React.createElement("a", {
    className: "underline text-[#a25a62]",
    href: "tel:+972548780808"
  }, "054-878-0808"), " \xB7 \u05D3\u05D5\u05D0\"\u05DC ", /*#__PURE__*/React.createElement("a", {
    className: "underline text-[#a25a62]",
    href: "mailto:avital.mpt.ibclc@gmail.com"
  }, "avital.mpt.ibclc@gmail.com")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-[#7c533c] leading-relaxed mb-4"
  }, "\u05E0\u05EA\u05E7\u05DC\u05EA \u05D1\u05E7\u05D5\u05E9\u05D9 \u05D1\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA? \u05E0\u05E9\u05DE\u05D7 \u05E9\u05EA\u05E4\u05E0\u05D9 \u05D0\u05DC\u05D9\u05E0\u05D5 \u05D5\u05E0\u05D8\u05E4\u05DC \u05D1\u05D4\u05E7\u05D3\u05DD. \u05D4\u05D4\u05E6\u05D4\u05E8\u05D4 \u05E2\u05D5\u05D3\u05DB\u05E0\u05D4 \u05D1\u05E1\u05E4\u05D8\u05DE\u05D1\u05E8 2026."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStmt(false),
    className: "w-full min-h-[44px] bg-[#e8b4b8] hover:bg-[#e2a3a8] text-[#5a3a28] font-bold py-3 rounded-xl"
  }, "\u05E1\u05D2\u05D9\u05E8\u05D4"))));
}

/* כרטיס בקשה ממתינה — המנהלת עורכת את הפרטים ואז מאשרת/דוחה */
function PendingCard({
  pending,
  onApprove,
  onReject
}) {
  const [draft, setDraft] = useState(pending);
  const [busy, setBusy] = useState(false);
  const set = patch => setDraft(d => ({
    ...d,
    ...patch
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-6 border-2 border-[#e8b4b8] shadow-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-[#f4a284] text-[#5a3a28] text-xs px-2.5 py-1 rounded-full font-bold inline-block mb-4"
  }, "\u05D1\u05E7\u05E9\u05D4 \u05D7\u05D3\u05E9\u05D4 \xB7 \u05E0\u05D9\u05EA\u05DF \u05DC\u05E2\u05E8\u05D5\u05DA \u05DC\u05E4\u05E0\u05D9 \u05D4\u05D0\u05D9\u05E9\u05D5\u05E8"), /*#__PURE__*/React.createElement(EditableFields, {
    data: draft,
    set: set
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-6"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: busy,
    onClick: async () => {
      setBusy(true);
      await onApprove(pending.id, draft);
      setBusy(false);
    },
    className: "flex-1 bg-[#e8b4b8] hover:bg-[#e2a3a8] disabled:opacity-60 text-[#5a3a28] py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-1"
  }, /*#__PURE__*/React.createElement(Eye, {
    size: 16
  }), " ", busy ? 'מאשר…' : 'אישור ופרסום'), /*#__PURE__*/React.createElement("button", {
    disabled: busy,
    onClick: () => {
      if (confirm('לדחות את הבקשה?')) onReject(pending.id);
    },
    className: "px-4 border-2 border-[#f3e1d3] text-[#a25a62] rounded-xl hover:bg-white disabled:opacity-60",
    title: "\u05D3\u05D7\u05D9\u05D9\u05D4"
  }, /*#__PURE__*/React.createElement(Trash, {
    size: 16
  }))));
}

/* שורת יועצת מפורסמת — תצוגה מצומצמת + מצב עריכה מלא */
function ConsultantRow({
  consultant,
  onUpdate,
  onRemove
}) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState(consultant);
  const set = patch => setDraft(d => ({
    ...d,
    ...patch
  }));
  if (editing) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-white rounded-2xl p-5 border-2 border-[#e8b4b8] shadow-sm"
    }, /*#__PURE__*/React.createElement(EditableFields, {
      data: draft,
      set: set
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mt-5"
    }, /*#__PURE__*/React.createElement("button", {
      disabled: busy,
      onClick: async () => {
        setBusy(true);
        await onUpdate(consultant.id, draft);
        setBusy(false);
        setEditing(false);
      },
      className: "flex-1 bg-[#e8b4b8] hover:bg-[#e2a3a8] disabled:opacity-60 text-[#5a3a28] py-2.5 rounded-xl font-bold text-sm transition"
    }, busy ? 'שומר…' : 'שמירת השינויים'), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setDraft(consultant);
        setEditing(false);
      },
      className: "px-4 border-2 border-[#f3e1d3] text-[#7c533c] rounded-xl text-sm hover:bg-[#fcf1e8]"
    }, "\u05D1\u05D9\u05D8\u05D5\u05DC")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 border border-[#f3e1d3] flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: consultant.image,
    name: consultant.name,
    className: "w-14 h-14 rounded-full flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-[#7c533c] truncate"
  }, consultant.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#8a5c47] truncate"
  }, consultant.credentials)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft(consultant);
      setEditing(true);
    },
    className: "text-xs bg-[#fdfaf6] border border-[#f3e1d3] px-3 py-2 rounded-lg hover:bg-[#fcf1e8] flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Pencil, {
    size: 14
  }), " \u05E2\u05E8\u05D9\u05DB\u05D4"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (confirm('להסיר את ' + consultant.name + ' מהאתר?')) onRemove(consultant.id);
    },
    className: "text-[#a25a62] hover:text-[#b8332b] p-2 rounded-lg hover:bg-[#fcf1e8]",
    title: "\u05D4\u05E1\u05E8\u05D4"
  }, /*#__PURE__*/React.createElement(Trash, {
    size: 16
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));