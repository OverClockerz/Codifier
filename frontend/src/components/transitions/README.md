# GSAP Page Transitions

This directory contains GSAP-based page transition components that match the vanilla JavaScript implementation. The transitions use staggered overlay animations for smooth, professional page changes.

## 🎬 Available Components

### 1. **PageTransition** (Default)
The main transition component with GSAP reveal animation.

```tsx
import { PageTransition } from './components/transitions/PageTransition';

<PageTransition transitionKey={isAuthenticated ? 'game' : 'landing'}>
  {isAuthenticated ? <GamePage /> : <LandingPage />}
</PageTransition>
```

**Features:**
- ✅ GSAP-powered reveal animation
- ✅ Staggered gradient overlays (blue → purple → dark)
- ✅ 0.6s duration with power2.inOut easing
- ✅ Motion React fade for content

---

### 2. **GSAPPageTransition**
Full GSAP transition with both hide and reveal animations.

```tsx
import { GSAPPageTransition } from './components/transitions/PageTransition';

<GSAPPageTransition transitionKey={currentPage}>
  {currentPage === 'home' ? <HomePage /> : <AboutPage />}
</GSAPPageTransition>
```

**Features:**
- ✅ Hide animation (bottom to top)
- ✅ Reveal animation (top to bottom)
- ✅ Automatic page change detection
- ✅ No Motion React dependency

---

### 3. **ZonePageTransition**
Themed transitions for game zones.

```tsx
import { ZonePageTransition } from './components/transitions/PageTransition';

<ZonePageTransition transitionKey={selectedZone} theme="workspace">
  <WorkspaceContent />
</ZonePageTransition>
```

**Themes:**
- `office` - Blue/Purple/Dark (default)
- `workspace` - Blue/Cyan/Teal
- `lounge` - Purple/Pink/Rose
- `meeting` - Orange/Red/Pink
- `cafeteria` - Green/Emerald/Teal

---

### 4. **TransitionOverlays**
Standalone overlay component for custom implementations.

```tsx
import { TransitionOverlays } from './components/transitions/TransitionOverlays';

const overlaysRef = useRef<HTMLDivElement>(null);

<TransitionOverlays ref={overlaysRef} />
```

---

### 5. **TransitionLink & TransitionButton**
Navigation components with automatic transitions.

```tsx
import { TransitionLink, TransitionButton } from './components/transitions/TransitionLink';

// Link with transition
<TransitionLink 
  href="#about" 
  onClick={(e) => setCurrentSection('about')}
  className="nav-link"
>
  About
</TransitionLink>

// Button with transition
<TransitionButton 
  onClick={() => setPage('dashboard')}
  className="btn-primary"
>
  Go to Dashboard
</TransitionButton>

// Disable transition for specific action
<TransitionButton 
  onClick={handleQuickAction}
  preventTransition={true}
>
  Quick Action
</TransitionButton>
```

---

## 🎯 Custom Hook

### **usePageTransition**
Low-level hook for custom transition logic.

```tsx
import { usePageTransition } from '../hooks/usePageTransition';

function MyComponent() {
  const { animateTransition, revealTransition, hideTransition } = usePageTransition();
  const overlaysRef = useRef<HTMLDivElement>(null);

  const handleNavigate = async () => {
    const overlays = overlaysRef.current?.querySelectorAll('.transition-overlay');
    if (overlays) {
      await animateTransition(overlays, () => {
        // Change page/state in the middle of transition
        setCurrentPage('newPage');
      });
    }
  };

  return (
    <>
      <TransitionOverlays ref={overlaysRef} />
      <button onClick={handleNavigate}>Navigate</button>
    </>
  );
}
```

**Methods:**
- `revealTransition(overlays)` - Show content (top to bottom)
- `hideTransition(overlays)` - Hide content (bottom to top)
- `animateTransition(overlays, callback)` - Full transition with callback

---

## 📐 Technical Details

### Animation Parameters

```javascript
// Reveal (showing content)
gsap.set(overlays, { 
  scaleY: 1, 
  transformOrigin: 'top' 
});
gsap.to(overlays, {
  scaleY: 0,
  duration: 0.6,
  stagger: -0.1,  // Reverse stagger
  ease: 'power2.inOut',
});

// Hide (hiding content)
gsap.set(overlays, { 
  scaleY: 0, 
  transformOrigin: 'bottom' 
});
gsap.to(overlays, {
  scaleY: 1,
  duration: 0.6,
  stagger: 0.1,   // Forward stagger
  ease: 'power2.inOut',
});
```

### Z-Index Hierarchy

```
z-[9999]  - Transition overlays (highest)
z-50      - Navigation/headers
z-40      - Modals
z-30      - Floating elements
z-20      - Tooltips
z-10      - Dropdowns
```

---

## 🎨 Customization

### Custom Colors

Create custom overlay themes:

```tsx
// In TransitionOverlays.tsx
export const MyCustomOverlay = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="transition-overlay absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500" />
      <div className="transition-overlay absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500" />
      <div className="transition-overlay absolute inset-0 bg-gray-950" />
    </div>
  );
});
```

### Custom Timing

Adjust transition speed:

```tsx
// Fast transition (0.4s)
gsap.to(overlays, {
  scaleY: 0,
  duration: 0.4,
  stagger: -0.08,
  ease: 'power2.inOut',
});

// Slow transition (1.0s)
gsap.to(overlays, {
  scaleY: 0,
  duration: 1.0,
  stagger: -0.15,
  ease: 'power2.inOut',
});
```

---

## 🚀 Usage Examples

### Example 1: Landing Page to Game

```tsx
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <PageTransition transitionKey={isAuthenticated ? 'game' : 'landing'}>
      {isAuthenticated ? <GamePage /> : <LandingPage />}
    </PageTransition>
  );
}
```

### Example 2: Multi-Page Navigation

```tsx
function MultiPageApp() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <nav>
        <TransitionLink onClick={() => setCurrentPage('home')}>Home</TransitionLink>
        <TransitionLink onClick={() => setCurrentPage('about')}>About</TransitionLink>
        <TransitionLink onClick={() => setCurrentPage('contact')}>Contact</TransitionLink>
      </nav>

      <GSAPPageTransition transitionKey={currentPage}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
      </GSAPPageTransition>
    </>
  );
}
```

### Example 3: Zone Selection

```tsx
function GameZones() {
  const [selectedZone, setSelectedZone] = useState<ZoneType>('workspace');

  return (
    <>
      <ZoneSelector onSelect={setSelectedZone} />
      
      <ZonePageTransition transitionKey={selectedZone} theme={selectedZone}>
        {selectedZone === 'workspace' && <Workspace />}
        {selectedZone === 'lounge' && <Lounge />}
        {selectedZone === 'meeting' && <MeetingRoom />}
        {selectedZone === 'cafeteria' && <Cafeteria />}
      </ZonePageTransition>
    </>
  );
}
```

---

## ⚠️ Important Notes

1. **Overlay Z-Index**: Overlays use `z-[9999]` to stay on top of all content
2. **Pointer Events**: Overlays have `pointer-events-none` to not block interaction
3. **State Updates**: Use `transitionKey` prop to trigger transitions
4. **Performance**: GSAP animations are GPU-accelerated for smooth 60fps
5. **Accessibility**: Content remains accessible during transitions

---

## 🐛 Troubleshooting

### Transitions not working?

1. **Check overlays exist:**
   ```tsx
   const overlays = document.querySelectorAll('.transition-overlay');
   console.log('Found overlays:', overlays.length);
   ```

2. **Ensure GSAP is imported:**
   ```tsx
   import gsap from 'gsap';
   ```

3. **Verify z-index hierarchy:**
   - Overlays should be `z-[9999]`
   - Content should be below that

### Overlays blocking interaction?

Make sure overlays have:
```tsx
className="... pointer-events-none ..."
```

### Transition cutting off?

Increase duration or adjust easing:
```tsx
duration: 0.8,  // Slower
ease: 'power1.inOut',  // Gentler
```

---

## 📚 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)
- [Motion React Docs](https://motion.dev/)
