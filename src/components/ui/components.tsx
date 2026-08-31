import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ===== BUTTON COMPONENT =====

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-700 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
  secondary: 'bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-500',
  outline: 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 focus-visible:ring-neutral-400',
  ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400',
  danger: 'bg-error text-white hover:bg-red-700 focus-visible:ring-red-500',
  accent: 'bg-accent-500 text-neutral-900 hover:bg-accent-400 focus-visible:ring-accent-400 font-semibold',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
  xl: 'px-8 py-4 text-lg gap-3',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  icon,
  iconRight,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  if ('href' in props && props.href) {
    const { href, target, rel, ...rest } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {icon}
        {children}
        {iconRight}
      </Link>
    );
  }

  const { ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

// ===== CARD COMPONENT =====

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className, hover = false, padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-border',
        paddingClasses[padding],
        hover && 'transition-all duration-200 hover:shadow-md hover:border-neutral-200 cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }} : undefined}
    >
      {children}
    </div>
  );
}

// ===== BADGE COMPONENT =====

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-light text-emerald-800',
  warning: 'bg-warning-light text-amber-800',
  error: 'bg-error-light text-red-800',
  info: 'bg-info-light text-blue-800',
  accent: 'bg-accent-100 text-accent-800',
};

export function Badge({ children, variant = 'default', className, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs',
        badgeVariantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ===== SECTION HEADING =====

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ badge, title, subtitle, align = 'center', className }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', 'mb-12 lg:mb-14', className)}>
      {badge && (
        <p className="label-text mb-4">{badge}</p>
      )}
      <h2 className={cn('display-lg text-neutral-900 mb-4', align === 'center' && 'max-w-3xl mx-auto')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-base text-neutral-500 max-w-xl leading-relaxed', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ===== SKELETON LOADER =====

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-neutral-100 rounded', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// ===== EMPTY STATE =====

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      {icon && <div className="flex justify-center mb-4 text-neutral-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">{title}</h3>
      <p className="text-neutral-500 max-w-md mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}

// ===== STEPPER COMPONENT =====

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Quote progress" className={cn('w-full', className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <li
              key={step}
              className={cn(
                'flex items-center',
                index < steps.length - 1 && 'flex-1'
              )}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors border-2',
                    isCompleted && 'bg-primary-700 border-primary-700 text-white',
                    isCurrent && 'border-primary-500 text-primary-700 bg-primary-50',
                    !isCompleted && !isCurrent && 'border-neutral-300 text-neutral-400 bg-white'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={cn(
                  'mt-1.5 text-xs font-medium hidden sm:block whitespace-nowrap',
                  isCurrent ? 'text-primary-700' : isCompleted ? 'text-neutral-600' : 'text-neutral-400'
                )}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    isCompleted ? 'bg-primary-700' : 'bg-neutral-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ===== ACCORDION COMPONENT =====

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  return (
    <details className="group border-b border-border" open={defaultOpen}>
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none font-semibold text-neutral-800 hover:text-primary-700 transition-colors">
        {title}
        <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </summary>
      <div className="pb-4 text-neutral-600 leading-relaxed">
        {children}
      </div>
    </details>
  );
}

// ===== BREADCRUMBS =====

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-neutral-500" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li
            key={item.label}
            className="flex items-center gap-2"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary-600 transition-colors" itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-neutral-800 font-medium" itemProp="name">{item.label}</span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
