import { ReactNode, MouseEvent } from 'react';
import gsap from 'gsap';

interface TransitionLinkProps {
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  preventTransition?: boolean;
}

/**
 * Link component with GSAP page transition
 * Use this for internal navigation that should trigger page transitions
 * 
 * @example
 * ```tsx
 * <TransitionLink href="#about" onClick={(e) => setCurrentSection('about')}>
 *   About
 * </TransitionLink>
 * ```
 */
export function TransitionLink({ 
  href, 
  onClick, 
  children, 
  className = '', 
  disabled = false,
  preventTransition = false 
}: TransitionLinkProps) {
  
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't do anything if disabled
    if (disabled) {
      e.preventDefault();
      return;
    }

    // Check if this is an external link
    if (href && (
      href.startsWith('http') || 
      href.startsWith('mailto:') || 
      href.startsWith('tel:')
    )) {
      // Allow default behavior for external links
      return;
    }

    // Check if this is the same page/section
    if (href && isSamePage(href)) {
      e.preventDefault();
      if (onClick) onClick(e);
      return;
    }

    // Prevent default and trigger transition
    e.preventDefault();

    // Skip transition if flag is set
    if (preventTransition) {
      if (onClick) onClick(e);
      return;
    }

    // Animate transition
    const overlays = document.querySelectorAll('.transition-overlay');
    if (overlays.length > 0) {
      animateTransition(overlays).then(() => {
        if (onClick) onClick(e);
      });
    } else {
      // Fallback if no overlays exist
      if (onClick) onClick(e);
    }
  };

  return (
    <a 
      href={href || '#'}
      onClick={handleClick}
      className={className}
      aria-disabled={disabled}
    >
      {children}
    </a>
  );
}

/**
 * Check if the link points to the same page
 */
function isSamePage(href: string): boolean {
  if (!href || href === '#' || href === '') return true;

  const currentPath = window.location.pathname;

  if (href === currentPath) return true;

  if (
    (currentPath === '/' || currentPath === '/index.html') &&
    (href === '/' ||
      href === '/index.html' ||
      href === 'index.html' ||
      href === './index.html')
  ) {
    return true;
  }

  const currentFileName = currentPath.split('/').pop() || 'index.html';
  const hrefFileName = href.split('/').pop();

  if (currentFileName === hrefFileName) return true;

  return false;
}

/**
 * Animate the page transition
 */
function animateTransition(overlays: NodeListOf<Element> | Element[]): Promise<void> {
  return new Promise((resolve) => {
    gsap.set(overlays, { scaleY: 0, transformOrigin: 'bottom' });
    gsap.to(overlays, {
      scaleY: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.inOut',
      onComplete: resolve,
    });
  });
}

/**
 * Button component with GSAP page transition
 * Similar to TransitionLink but for button elements
 */
export function TransitionButton({
  onClick,
  children,
  className = '',
  disabled = false,
  type = 'button',
  preventTransition = false,
}: {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  preventTransition?: boolean;
}) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Skip transition if flag is set
    if (preventTransition) {
      if (onClick) onClick(e);
      return;
    }

    const overlays = document.querySelectorAll('.transition-overlay');
    if (overlays.length > 0) {
      animateTransition(overlays).then(() => {
        if (onClick) onClick(e);
      });
    } else {
      if (onClick) onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
