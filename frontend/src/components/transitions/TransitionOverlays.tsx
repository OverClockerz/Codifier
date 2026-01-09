import { forwardRef } from 'react';

/**
 * Transition Overlays Component
 * Creates the layered overlays used for GSAP page transitions
 * Matches the vanilla JS implementation with staggered color layers
 */
export const TransitionOverlays = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div 
      ref={ref}
      className="fixed inset-0 pointer-events-none z-9999"
      style={{ isolation: 'isolate' }}
    >
      {/* Layer 1: Blue to Purple gradient */}
      <div className="transition-overlay absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600" />
      
      {/* Layer 2: Purple to Pink gradient */}
      <div className="transition-overlay absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
      
      {/* Layer 3: Dark overlay (final layer) */}
      <div className="transition-overlay absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
    </div>
  );
});

TransitionOverlays.displayName = 'TransitionOverlays';

/**
 * Custom themed overlay variants
 */
export const TransitionOverlaysCustom = forwardRef<HTMLDivElement, { theme?: 'office' | 'workspace' | 'lounge' | 'meeting' | 'cafeteria' }>(
  ({ theme = 'office' }, ref) => {
    const themes = {
      office: [
        'bg-gradient-to-br from-blue-600 to-purple-600',
        'bg-gradient-to-br from-purple-600 to-pink-600',
        'bg-gradient-to-br from-gray-900 to-black',
      ],
      workspace: [
        'bg-gradient-to-br from-blue-500 to-cyan-500',
        'bg-gradient-to-br from-cyan-500 to-teal-500',
        'bg-gradient-to-br from-gray-900 to-blue-950',
      ],
      lounge: [
        'bg-gradient-to-br from-purple-500 to-pink-500',
        'bg-gradient-to-br from-pink-500 to-rose-500',
        'bg-gradient-to-br from-gray-900 to-purple-950',
      ],
      meeting: [
        'bg-gradient-to-br from-orange-500 to-red-500',
        'bg-gradient-to-br from-red-500 to-pink-500',
        'bg-gradient-to-br from-gray-900 to-orange-950',
      ],
      cafeteria: [
        'bg-gradient-to-br from-green-500 to-emerald-500',
        'bg-gradient-to-br from-emerald-500 to-teal-500',
        'bg-gradient-to-br from-gray-900 to-green-950',
      ],
    };

    const colors = themes[theme];

    return (
      <div 
        ref={ref}
        className="fixed inset-0 pointer-events-none z-9999"
        style={{ isolation: 'isolate' }}
      >
        <div className={`transition-overlay absolute inset-0 ${colors[0]}`} />
        <div className={`transition-overlay absolute inset-0 ${colors[1]}`} />
        <div className={`transition-overlay absolute inset-0 ${colors[2]}`} />
      </div>
    );
  }
);

TransitionOverlaysCustom.displayName = 'TransitionOverlaysCustom';
