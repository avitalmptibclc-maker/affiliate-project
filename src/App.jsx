import React, { useEffect, useState } from 'react';
import { Shield, Phone, MessageCircle, Check, Upload, User, Award, MapPin, Eye, Lock, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';

const defaultConsultants = [
  {
    id: 1,
    name: "אביטל עציון",
    credentials: "פיזיותרפיסטית MPT, יועצת הנקה IBCLC",
    statement: "הנקה זאת מיומנות התפתחותית והקשרותית שאין לה תחליף. אני כאן כדי לעזור לך להיות האמא שאת חולמת להיות.",
    location: "אילת / אונליין",
    channels: { homeVisit: true, clinic: true, weeklyClinic: true, online: true },
    additional_fields: "פיזיותרפיה לרצפת האגן, פיזיותרפיה התפתחותית. הכנה להנקה!! ייעוץ אחרי לידה",
    phone: "0548780808",
    email: "abiTal@example.com",
    image: "/api/placeholder/150/150"
  }
];

export default function LactationHubEilat() {
  // ניתוב פנימי בין מסכים: 'home' (ציבורי), 'register' (טופס יועצת), 'admin' (פאנל ניהול)
  const [view, setView] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [sortOrder, setSortOrder] = useState('registered'); // 'registered', 'a-z', 'z-a'
  const ADMIN_PASSWORD = 'abiTal2026'; // סיסמה אמיתית - שנה לסיסמה שלך
  
  // מאגר יועצות מאושרות - הפרטים שלך כמודל ראשון באתר
  const [consultants, setConsultants] = useState(defaultConsultants);

  // מאגר זמני ליועצות שמחכות לאישור שלך
  const [pendingConsultants, setPendingConsultants] = useState([]);

  // סטייט לטופס הרישום של יועצת חדשה
  const [formData, setFormData] = useState({
    name: '', credentials: '', statement: '', location: 'אילת',
    homeVisit: false, clinic: false, weeklyClinic: false, online: false,
    additionalFields: '', phone: ''
  });

  // סטייט זמני לעריכת תמונה בפאנל הניהול
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const haveSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  useEffect(() => {
    if (!haveSupabase) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: consultantsData, error: consultantsError } = await supabase
          .from('consultants')
          .select('*')
          .order('id', { ascending: false });

        const { data: pendingData, error: pendingError } = await supabase
          .from('pending_consultants')
          .select('*')
          .order('id', { ascending: false });

        if (consultantsError || pendingError) throw consultantsError || pendingError;

        setConsultants(consultantsData && consultantsData.length ? consultantsData : defaultConsultants);
        setPendingConsultants(pendingData || []);
      } catch (err) {
        setError(err.message || 'שגיאה בטעינת נתונים');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [haveSupabase]);

  const handleAdminAccess = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setView('admin');
      setAdminPassword('');
    } else {
      alert('סיסמה לא נכונה');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPassword('');
    setView('home');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newPending = {
      name: formData.name,
      credentials: formData.credentials,
      statement: formData.statement,
      location: formData.location,
      phone: formData.phone,
      additional_fields: formData.additionalFields,
      channels: {
        homeVisit: formData.homeVisit,
        clinic: formData.clinic,
        weeklyClinic: formData.weeklyClinic,
        online: formData.online
      },
      image: "/api/placeholder/150/150"
    };

    if (!haveSupabase) {
      setPendingConsultants([{
        ...newPending,
        id: Date.now()
      }, ...pendingConsultants]);
    } else {
      try {
        const { data, error } = await supabase
          .from('pending_consultants')
          .insert([newPending])
          .select()
          .single();

        if (error) throw error;
        setPendingConsultants(prev => [data, ...prev]);
      } catch (err) {
        console.error(err);
        alert('שגיאה בשליחת הבקשה. נסי שוב בבקשה.');
        return;
      }
    }

    alert("הפרטים נשלחו בהצלחה וממתינים לאישור של אביטל!");
    setView('home');
    setFormData({
      name: '', credentials: '', statement: '', location: 'אילת',
      homeVisit: false, clinic: false, weeklyClinic: false, online: false,
      additionalFields: '', phone: ''
    });
  };

  const handleApprove = async (id) => {
    const consultantToApprove = pendingConsultants.find(c => c.id === id);
    if (!consultantToApprove) return;

    const approvedRecord = {
      ...consultantToApprove,
      image: selectedImage || consultantToApprove.image
    };

    if (haveSupabase) {
      try {
        const payload = { ...approvedRecord };
        delete payload.id;

        const { data, error } = await supabase
          .from('consultants')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        const { error: deleteError } = await supabase
          .from('pending_consultants')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        setConsultants(prev => [data, ...prev]);
      } catch (err) {
        console.error(err);
        alert('שגיאה באישור היועצת. נסי שוב בבקשה.');
        return;
      }
    } else {
      setConsultants(prev => [approvedRecord, ...prev]);
    }

    setPendingConsultants(prev => prev.filter(c => c.id !== id));
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen font-sans text-[#8B6B5C] bg-[#FBF7F3]" dir="rtl" style={{ fontFamily: "'Alef Hebrew', 'Arial', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alef:wght@400;700&display=swap');
        * { font-family: 'Alef Hebrew', 'Arial', sans-serif; }
      `}</style>
      
      {/* בר ניווט עליון עדין */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#E8D4C4] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          {/* לוגו בסגנון הלוגו שלך */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF7F] via-[#F4A284] to-[#E8B4B8] flex items-center justify-center text-white font-bold text-sm shadow-md">א</div>
          <span className="font-bold text-lg text-[#8B6B5C]">יועצות ההנקה של אילת</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView('home')} className={`px-4 py-2 rounded-full text-sm transition font-medium ${view === 'home' ? 'bg-gradient-to-r from-[#E8B4B8] to-[#F4A284] text-white' : 'hover:bg-[#FBF0E8] text-[#8B6B5C]'}`}>דף הבית</button>
          <button onClick={() => setView('register')} className={`px-4 py-2 rounded-full text-sm transition font-medium ${view === 'register' ? 'bg-gradient-to-r from-[#E8B4B8] to-[#F4A284] text-white' : 'hover:bg-[#FBF0E8] text-[#8B6B5C]'}`}>הצטרפות למיזם</button>
        </div>
      </nav>

      {loading && (
        <div className="px-6 py-3 bg-[#fff2e8] text-[#7c533c] text-sm text-center border-b border-[#e8d4c4]">
          טוען נתונים מ-Supabase…
        </div>
      )}

      {error && (
        <div className="px-6 py-3 bg-[#f7d2cb] text-[#7c1f13] text-sm text-center border-b border-[#e8d4c4]">
          {error}
        </div>
      )}

      {/* מודל אימות מנהל */}
      {!isAdminAuthenticated && (
        <div id="adminTrigger" className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              const pwd = prompt('הזן סיסמה לאזור הניהול:');
              if (pwd) {
                setAdminPassword(pwd);
                if (pwd === ADMIN_PASSWORD) {
                  setIsAdminAuthenticated(true);
                  setView('admin');
                } else {
                  alert('סיסמה לא נכונה');
                }
              }
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF7F] to-[#8B6B5C] text-white shadow-lg hover:shadow-xl transition flex items-center justify-center"
            title="אזור ניהול"
          >
            <Shield size={20} />
          </button>
        </div>
      )}

      {/* בר ניהול עליון (רק כשמחובר) */}
      {isAdminAuthenticated && (
        <div className="bg-gradient-to-r from-[#D4AF7F] to-[#F4A284] text-white px-6 py-3 flex justify-between items-center">
          <span className="font-bold">🔒 אזור ניהול - מחובר כמנהלת</span>
          <div className="flex gap-3">
            <button onClick={() => setView('admin')} className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30">ניהול בקשות</button>
            <button onClick={handleLogout} className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 flex items-center gap-1">
              <LogOut size={14} /> יציאה
            </button>
          </div>
        </div>
      )}

      {/* 1. תצוגת דף הבית הציבורי */}
      {view === 'home' && (
        <div>
          {/* אזור ה-Hero בהשראת הלוגו שבחרת */}
          <header className="py-16 px-6 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FEF9F5] to-[#FBF7F3] rounded-3xl mt-6 border border-[#E8D4C4]">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#8B6B5C] mb-4">להתחלה רכה.</h1>
            <p className="text-xl text-[#9B8878] max-w-2xl mx-auto font-light leading-relaxed">
              ריכוז של כל יועצות ומדריכות ההנקה המוסמכות באילת. הכתובת שלך לרגעים שבהם את צריכה תמיכה, הכוונה מקצועית ויד מחבקת.
            </p>
          </header>

          {/* כפתורי מיון */}
          <div className="max-w-6xl mx-auto px-6 py-8 flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setSortOrder('registered')}
              className={`px-4 py-2 rounded-full text-sm transition font-medium ${
                sortOrder === 'registered'
                  ? 'bg-gradient-to-r from-[#E8B4B8] to-[#F4A284] text-white'
                  : 'bg-[#E8D4C4] text-[#8B6B5C] hover:bg-[#D9C5B5]'
              }`}
            >
              📅 סדר הרשמה
            </button>
            <button
              onClick={() => setSortOrder('a-z')}
              className={`px-4 py-2 rounded-full text-sm transition font-medium ${
                sortOrder === 'a-z'
                  ? 'bg-gradient-to-r from-[#E8B4B8] to-[#F4A284] text-white'
                  : 'bg-[#E8D4C4] text-[#8B6B5C] hover:bg-[#D9C5B5]'
              }`}
            >
              א-ב א" ל- ת"
            </button>
            <button
              onClick={() => setSortOrder('z-a')}
              className={`px-4 py-2 rounded-full text-sm transition font-medium ${
                sortOrder === 'z-a'
                  ? 'bg-gradient-to-r from-[#E8B4B8] to-[#F4A284] text-white'
                  : 'bg-[#E8D4C4] text-[#8B6B5C] hover:bg-[#D9C5B5]'
              }`}
            >
              ת-א ת" ל- א"
            </button>
          </div>

          {/* רשת כרטיסיות היועצות */}
          <main className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {consultants
                .sort((a, b) => {
                  if (sortOrder === 'a-z') {
                    return a.name.localeCompare(b.name, 'he');
                  } else if (sortOrder === 'z-a') {
                    return b.name.localeCompare(a.name, 'he');
                  } else {
                    // registered - סדר מקורי (לפי ID - חדשים ראשונים)
                    return b.id - a.id;
                  }
                })
                .map((coach) => (
                <div key={coach.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8D4C4] transition-all hover:shadow-md flex flex-col justify-between">
                  <div>
                    {/* פרופיל וכותרת */}
                    <div className="flex items-start gap-4 mb-4">
                      <img src={coach.image} alt={coach.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-[#E8B4B8] shadow-sm" />
                      <div>
                        <h3 className="text-2xl font-bold text-[#8B6B5C]">{coach.name}</h3>
                        <p className="text-sm font-medium text-[#C4897B] mb-2">{coach.credentials}</p>
                        <div className="flex items-center gap-1 text-xs text-[#9B8878]">
                          <MapPin size={14} className="text-[#F4A284]" />
                          <span>{coach.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* הסטייטמנט המקרב */}
                    <blockquote className="bg-[#FEF9F5] border-r-4 border-[#E8B4B8] p-3 rounded-l-xl text-sm italic text-[#8B6B5C] my-4 leading-relaxed">
                      "{coach.statement}"
                    </blockquote>

                    {/* תגיות סימון מהירות (קליניקה / ביקורי בית) */}
                    <div className="flex flex-wrap gap-2 my-4">
                      {coach.channels.homeVisit && <span className="bg-[#E8D4C4] text-[#8B6B5C] text-xs px-3 py-1 rounded-full font-medium">✓ ביקורי בית</span>}
                      {coach.channels.clinic && <span className="bg-[#E8D4C4] text-[#8B6B5C] text-xs px-3 py-1 rounded-full font-medium">✓ טיפול בקליניקה</span>}
                      {coach.channels.weeklyClinic && <span className="bg-[#E8D4C4] text-[#8B6B5C] text-xs px-3 py-1 rounded-full font-medium">✓ קליניקת אמהות שבועית</span>}
                      {coach.channels.online && <span className="bg-[#E8D4C4] text-[#8B6B5C] text-xs px-3 py-1 rounded-full font-medium">✓ אונליין</span>}
                    </div>

                    {/* תחומי טיפול נוספים (טקסט חופשי) */}
                    <div className="mt-4 pt-4 border-t border-[#FBF0E8]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4897B] mb-2">תחומי טיפול נוספים והתמחויות:</h4>
                      <p className="text-sm text-[#8B6B5C] leading-relaxed whitespace-pre-line">{coach.additional_fields}</p>
                    </div>
                  </div>

                  {/* הערה שקישור יישלח ישירות */}
                  <div className="mt-6 pt-4 border-t border-[#FBF0E8] bg-[#FBF0E8] p-3 rounded-xl text-center">
                    <p className="text-xs text-[#9B8878]">📱 קישור ישירה יישלח לך באופן אישי</p>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* 2. ממשק רישום והזנת פרטים ליועצות */}
      {view === 'register' && (
        <main className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e1d3]">
            <h2 className="text-3xl font-bold text-[#7c533c] mb-2">הצטרפי לקהילת היועצות שלנו</h2>
            <p className="text-sm text-[#a0715c] mb-8">מלאי את פרטייך המקצועיים. הפרטים יעברו לאישור ועריכת תמונה על ידי אביטל לפני הפרסום בדף הבית.</p>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">שם מלא</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] focus:outline-none focus:border-[#e8b4b8]" placeholder="לדוגמה: אביטל עציון" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">תארים והסמכות מקצועיות</label>
                <input type="text" required value={formData.credentials} onChange={e => setFormData({...formData, credentials: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] focus:outline-none focus:border-[#e8b4b8]" placeholder="כתבי כאן את ההסמכות המקצועיות שלך..." />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">הגישה שלי (המשפט שמחבר אותך לאמא)</label>
                <textarea required rows={2} value={formData.statement} onChange={e => setFormData({...formData, statement: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] focus:outline-none focus:border-[#e8b4b8]" placeholder="משפט קצר שפונה לאמא בגובה העיניים..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">אזור פעילות</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] focus:outline-none focus:border-[#e8b4b8]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">מספר טלפון (וואטסאפ ושיחות)</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] focus:outline-none focus:border-[#e8b4b8]" placeholder="054XXXXXXX" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">איך ניתן לקבל אצלך שירות? (סמני את כל האפשרויות)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[['homeVisit', 'ביקורי בית'], ['clinic', 'טיפול בקליניקה'], ['weeklyClinic', 'קליניקת אמהות שבועית'], ['online', 'אונליין / מרחוק']].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 p-3 border border-[#f3e1d3] rounded-xl cursor-pointer bg-[#fdfaf6] hover:bg-white select-none">
                      <input type="checkbox" checked={formData[key]} onChange={e => setFormData({...formData, [key]: e.target.checked})} className="accent-[#e8b4b8] w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">תחומי טיפול נוספים והתמחויות מיוחדות (טקסט חופשי)</label>
                <textarea rows={4} value={formData.additionalFields} onChange={e => setFormData({...formData, additionalFields: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#f3e1d3] bg-[#fdfaf6] focus:outline-none focus:border-[#e8b4b8]" placeholder="כתבי כאן בחופשיות על ההכשרות, הכלים והמיומנויות הנוספות שאת מביאה איתך..." />
              </div>

              <p className="text-xs text-[#a0715c] bg-[#fdfaf6] p-3 rounded-xl leading-relaxed text-center">
                בהרשמה לאתר הינך מאשרת את הסכמתך להיכלל ברשימת יועצות ההנקה של אילת. הפרטים שתמלאי נשמרים לצורך הצגתך במאגר בלבד, ולא יועברו לגורם שלישי. להסרה בכל עת ניתן לפנות לאביטל.
              </p>

              <button type="submit" className="w-full bg-[#e8b4b8] hover:bg-[#e2a3a8] text-white font-bold py-4 rounded-xl shadow-sm transition">
                שליחת פרטים לאישור
              </button>
            </form>
          </div>
        </main>
      )}

      {/* 3. פאנל הניהול והאישור הפרטי שלך (אביטל) */}
      {view === 'admin' && (
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#7c533c]">פאנל ניהול ואישור בקשות</h2>
              <p className="text-sm text-[#a0715c]">כאן את מאשרת את היועצות, מעלה להן תמונה שמתאימה לשפה הגרפית, ומעלה אותן לאתר.</p>
            </div>
            <div className="bg-[#f0e4dc] text-[#7c533c] px-4 py-2 rounded-xl text-sm font-bold">
              בקשות הממתינות לאישור: {pendingConsultants.length}
            </div>
          </div>

          {pendingConsultants.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#f3e1d3] text-[#a0715c]">
              <Check size={48} className="mx-auto text-[#f4a284] mb-4" />
              <p className="text-lg font-medium">אין בקשות חדשות הממתינות לאישור כרגע.</p>
              <p className="text-sm mt-1">כשיועצות ירשמו בטופס, הן יופיעו כאן מיד.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {pendingConsultants.map((pending) => (
                <div key={pending.id} className="bg-white rounded-3xl p-6 border-2 border-[#e8b4b8] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* עמודה 1: הפרטים שנשלחו */}
                  <div className="md:col-span-2 space-y-3">
                    <span className="bg-[#f4a284] text-white text-xs px-2.5 py-1 rounded-full font-bold">בקשה חדשה</span>
                    <h3 className="text-2xl font-bold">{pending.name}</h3>
                    <p className="text-sm text-[#c0848a] font-medium">{pending.credentials}</p>
                    <p className="text-sm bg-[#fdfaf6] p-3 rounded-xl italic">"{pending.statement}"</p>
                    <p className="text-sm font-semibold text-[#7c533c]">תחומי טיפול נוספים:</p>
                    <p className="text-sm text-[#a0715c] bg-[#fdfaf6] p-3 rounded-xl whitespace-pre-line">{pending.additional_fields}</p>
                    <p className="text-xs text-[#a0715c]">טלפון: {pending.phone} | מיקום: {pending.location}</p>
                  </div>

                  {/* עמודה 2: העלאת תמונה ואישור */}
                  <div className="flex flex-col justify-between bg-[#fdfbf9] p-4 rounded-2xl border border-[#f3e1d3]">
                    <div>
                      <h4 className="text-xs font-bold text-[#c0848a] mb-3 uppercase tracking-wider">שפה גרפית ותמונה:</h4>
                      
                      {/* סימולציה של העלאת תמונה מקומית */}
                      <div className="border-2 border-dashed border-[#f3e1d3] rounded-xl p-4 text-center cursor-pointer hover:bg-white transition relative">
                        <input type="file" accept="image/*" onChange={(e) => {
                          // בקוד אמיתי נמיר ל-URL מקומי, כאן נשים פלייסהולדר מותאם לשם הדגמה
                          setSelectedImage("/api/placeholder/150/150");
                        }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <Upload size={24} className="mx-auto text-[#c0848a] mb-2" />
                        <p className="text-xs font-medium">לחצי להחלפת התמונה של היועצת</p>
                        <p className="text-[10px] text-[#a0715c] mt-1">(להתאמה לצבעי האתר)</p>
                      </div>

                      {selectedImage && (
                        <div className="mt-3 flex items-center gap-2 bg-white p-2 rounded-xl border border-[#f3e1d3]">
                          <div className="w-10 h-10 bg-[#e8b4b8] rounded-lg flex items-center justify-center text-white text-xs">✓</div>
                          <p className="text-xs font-medium text-[#7c533c]">התמונה הותאמה בהצלחה!</p>
                        </div>
                      )}
                    </div>

                    <button onClick={() => handleApprove(pending.id)} className="w-full bg-[#e8b4b8] hover:bg-[#e2a3a8] text-white py-3 rounded-xl font-bold text-sm transition mt-4 flex items-center justify-center gap-2">
                      <Eye size={16} /> אשר והעלה לדף הציבורי
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      )}

    </div>
  );
}
