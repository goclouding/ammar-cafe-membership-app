export default function Logo({ size = 120, className = '' }) {
  return (
    <img
      src="/ammarcafe-logo.png"
      alt="Ammar Cafe"
      width={size}
      height={size}
      className={`drop-shadow-lg ${className}`}
      style={{ width: size, height: 'auto' }}
    />
  )
}
