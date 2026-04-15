import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const AGES = [...Array(41).keys()].map(i => i + 24).concat(['65+'])

const initial = {
  full_name: '',
  age: '',
  marital_status: '',
  city: '',
  email: '',
  mobile_number: '',
  linkedin_url: '',
  instagram_url: '',
  employer: '',
  job_title: '',
  invited_by_member: '',
  inviter_name: '',
  agree_terms: false,
}

function validate(v) {
  const e = {}
  if (!v.full_name.trim()) e.full_name = 'الاسم الكامل مطلوب'
  if (!v.age) e.age = 'العمر مطلوب'
  if (!['married', 'single'].includes(v.marital_status)) e.marital_status = 'الحالة الاجتماعية مطلوبة'
  if (!v.city.trim()) e.city = 'المدينة مطلوبة'
  if (!v.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'بريد إلكتروني غير صالح'
  if (!v.mobile_number.trim() || !/^[0-9+\s\-()]+$/.test(v.mobile_number)) e.mobile_number = 'رقم جوال غير صالح'
  if (v.linkedin_url && !/^https?:\/\//.test(v.linkedin_url)) e.linkedin_url = 'رابط غير صالح'
  if (v.instagram_url && !/^https?:\/\//.test(v.instagram_url)) e.instagram_url = 'رابط غير صالح'
  if (!v.employer.trim()) e.employer = 'جهة العمل مطلوبة'
  if (!v.job_title.trim()) e.job_title = 'المسمى الوظيفي مطلوب'
  if (!['yes', 'no'].includes(v.invited_by_member)) e.invited_by_member = 'هذا الحقل مطلوب'
  if (v.invited_by_member === 'yes' && !v.inviter_name.trim()) e.inviter_name = 'اسم العضو الذي دعاك مطلوب'
  if (!v.agree_terms) e.agree_terms = 'يجب الموافقة على الشروط والأحكام'
  return e
}

export default function MembershipForm() {
  const [v, setV] = useState(initial)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setV(s => ({ ...s, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSubmitting(true)
    const age = v.age === '65+' ? 65 : parseInt(v.age, 10)
    const { error } = await supabase.from('membership_applications').insert({
      full_name: v.full_name.trim(),
      age,
      marital_status: v.marital_status,
      city: v.city.trim(),
      email: v.email.trim().toLowerCase(),
      mobile_number: v.mobile_number.trim(),
      linkedin_url: v.linkedin_url.trim() || null,
      instagram_url: v.instagram_url.trim() || null,
      employer: v.employer.trim(),
      job_title: v.job_title.trim(),
      invited_by_member: v.invited_by_member === 'yes',
      inviter_name: v.invited_by_member === 'yes' ? v.inviter_name.trim() : null,
      agreed_terms: true,
      status: 'pending',
    })
    setSubmitting(false)
    if (error) {
      setServerError('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.')
      console.error(error)
      return
    }
    navigate(`/success?name=${encodeURIComponent(v.full_name.trim())}`)
  }

  const Err = ({ name }) => errors[name] ? <p className="text-danger text-sm mt-1">{errors[name]}</p> : null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="pt-10 pb-6 text-center">
        <Logo size={140} className="mx-auto" />
        <h1 className="text-3xl md:text-4xl font-bold text-gold mt-4">عضوية VIP Lounge</h1>
        <p className="text-muted mt-1">الضيافة الخاصة</p>
        <div className="mx-auto mt-4 h-px w-24 bg-gold/60" />
      </header>

      {/* Form */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-12">
        {serverError && (
          <div className="bg-danger/20 border border-danger/50 text-cream rounded-lg p-4 mb-4">
            {serverError}
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="bg-danger/20 border border-danger/50 text-cream rounded-lg p-4 mb-4">
            يرجى تصحيح الأخطاء أدناه.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Personal */}
          <section className="glass-card">
            <h2 className="section-title">المعلومات الشخصية</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">الاسم الكامل</label>
                <input className="input" type="text" maxLength={100} value={v.full_name} onChange={set('full_name')} />
                <Err name="full_name" />
              </div>
              <div>
                <label className="label">العمر</label>
                <select className="select" value={v.age} onChange={set('age')}>
                  <option value="">اختر...</option>
                  {AGES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <Err name="age" />
              </div>
              <div>
                <label className="label">الحالة الاجتماعية</label>
                <select className="select" value={v.marital_status} onChange={set('marital_status')}>
                  <option value="">اختر...</option>
                  <option value="married">متزوج</option>
                  <option value="single">أعزب</option>
                </select>
                <Err name="marital_status" />
              </div>
              <div>
                <label className="label">مدينة الإقامة</label>
                <input className="input" type="text" maxLength={100} value={v.city} onChange={set('city')} />
                <Err name="city" />
              </div>
              <div>
                <label className="label">البريد الإلكتروني</label>
                <input className="input" type="email" dir="ltr" maxLength={150} value={v.email} onChange={set('email')} />
                <Err name="email" />
              </div>
              <div>
                <label className="label">رقم الجوال</label>
                <input className="input" type="tel" dir="ltr" maxLength={20} value={v.mobile_number} onChange={set('mobile_number')} />
                <Err name="mobile_number" />
              </div>
              <div>
                <label className="label">حساب LinkedIn <span className="text-muted font-normal">(اختياري)</span></label>
                <input className="input" type="url" dir="ltr" maxLength={255} value={v.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/..." />
                <Err name="linkedin_url" />
              </div>
              <div>
                <label className="label">حساب Instagram <span className="text-muted font-normal">(اختياري)</span></label>
                <input className="input" type="url" dir="ltr" maxLength={255} value={v.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/..." />
                <Err name="instagram_url" />
              </div>
            </div>
          </section>

          {/* Professional */}
          <section className="glass-card">
            <h2 className="section-title">المعلومات المهنية</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">جهة العمل</label>
                <input className="input" type="text" maxLength={150} value={v.employer} onChange={set('employer')} />
                <Err name="employer" />
              </div>
              <div>
                <label className="label">المسمى الوظيفي</label>
                <input className="input" type="text" maxLength={150} value={v.job_title} onChange={set('job_title')} />
                <Err name="job_title" />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">هل تلقيت دعوة من عضو حالي؟</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="invited_by_member" value="yes" checked={v.invited_by_member === 'yes'} onChange={set('invited_by_member')} />
                  <span>نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="invited_by_member" value="no" checked={v.invited_by_member === 'no'} onChange={set('invited_by_member')} />
                  <span>لا</span>
                </label>
              </div>
              <Err name="invited_by_member" />
            </div>
            {v.invited_by_member === 'yes' && (
              <div className="mt-4">
                <label className="label">اسم العضو الذي دعاك</label>
                <input className="input" type="text" maxLength={100} value={v.inviter_name} onChange={set('inviter_name')} />
                <Err name="inviter_name" />
              </div>
            )}
          </section>

          {/* Terms */}
          <section className="glass-card">
            <h2 className="section-title">الشروط والأحكام</h2>
            <ol className="list-decimal pr-6 space-y-2 text-muted mb-4">
              <li>العضوية شخصية وغير قابلة للتحويل.</li>
              <li>يلتزم العضو بآداب المكان واحترام الضيوف الآخرين.</li>
              <li>تحتفظ الإدارة بحق قبول أو رفض طلب العضوية.</li>
              <li>يلتزم العضو باللباس المناسب (Smart Casual) داخل الصالة.</li>
              <li>قد يتم إلغاء العضوية في حال الإخلال بالشروط.</li>
            </ol>
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 text-sm text-muted mb-4">
              ملاحظة: سيتم التواصل معك خلال 3-5 أيام عمل للرد على طلبك.
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" checked={v.agree_terms} onChange={set('agree_terms')} />
              <span>أوافق على الشروط والأحكام المذكورة أعلاه.</span>
            </label>
            <Err name="agree_terms" />
          </section>

          <div className="flex justify-center">
            <button type="submit" disabled={submitting} className="btn-primary text-lg px-10 py-4">
              {submitting ? '...جاري الإرسال' : 'إرسال الطلب'}
            </button>
          </div>
        </form>
      </main>

      <footer className="text-center text-muted text-xs py-4">
        © {new Date().getFullYear()} Ammar Cafe — جميع الحقوق محفوظة
      </footer>
    </div>
  )
}
