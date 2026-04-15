import { Link, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Success() {
  const [params] = useSearchParams()
  const name = params.get('name') || ''
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full text-center">
        <Logo size={100} className="mx-auto" />
        <div className="mx-auto my-6 w-20 h-20 rounded-full bg-ok/20 border-4 border-ok flex items-center justify-center">
          <span className="text-ok text-4xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gold mb-2">تم استلام طلبك!</h1>
        <p className="text-cream mb-2">{name && `شكراً لك ${name}!`}</p>
        <p className="text-muted mb-6">سيتم التواصل معك قريباً لإكمال إجراءات العضوية.</p>
        <Link to="/" className="btn-primary">العودة للرئيسية</Link>
      </div>
    </div>
  )
}
