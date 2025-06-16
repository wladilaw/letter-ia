import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Spinner } from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  href?: string
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  href,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-dark focus:ring-accent",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }

  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    { 'opacity-50 cursor-not-allowed': disabled || loading },
    className
  )

  const content = (
    <>
      {loading && <Spinner className="w-4 h-4 mr-2" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled || loading} 
      {...props}
    >
      {content}
    </button>
  )
} 