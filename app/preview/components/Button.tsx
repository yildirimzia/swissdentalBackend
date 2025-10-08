'use client';
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'customOutline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom16';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  rounded?: string;
  /** İkon-only kullanımda zorunlu erişilebilir ad */
  ariaLabel?: string;
}

const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-hover-small',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-md hover:shadow-hover-small',
  outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  danger: 'bg-error-500 hover:bg-error-600 text-white shadow-md hover:shadow-hover-small',
  customOutline: `
    bg-[#f9f9f9] text-[#005752] border border-[#e0e0e0]
    hover:bg-[#005752] hover:text-white hover:border-[#005752]
    focus:ring-2 focus:ring-[rgba(190,203,203,0.5)]
    active:bg-[#005752] active:text-white active:border-[#005752]
    active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.125)]
    disabled:text-[#005752] disabled:bg-white disabled:border-white
    transition-all duration-200
  `.replace(/\s+/g, ' ').trim(),
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
  custom16: 'px-6 py-3 text-[16px]',
};

const baseClasses =
  'inline-flex items-center justify-center font-semibold transition-all duration-300 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const hasVisibleText = (children: React.ReactNode) =>
  React.Children.toArray(children).some(
    (c) => (typeof c === 'string' && c.trim().length > 0) || typeof c === 'number'
  );

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  rounded = 'rounded-lg',
  disabled,
  ariaLabel,
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;
  const textPresent = hasVisibleText(children);

  // ikon-only ise aria-label zorunlu
  if (process.env.NODE_ENV !== 'production' && !textPresent && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Button] Icon-only kullanımda `ariaLabel` zorunludur. Örn: <Button icon={<… />} ariaLabel="Videoyu oynat" />'
    );
  }

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    rounded,
    fullWidth ? 'w-full' : '',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const accessibleProps = textPresent
    ? {}
    : { 'aria-label': ariaLabel ?? 'Buton' }; // son çare default

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...accessibleProps}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          {/* Ekran okuyucu için metin */}
          <span className="sr-only">Yükleniyor…</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span aria-hidden="true" className="mr-2">{icon}</span>}
          {textPresent ? <span>{children}</span> : <span className="sr-only">{ariaLabel}</span>}
          {icon && iconPosition === 'right' && <span aria-hidden="true" className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
