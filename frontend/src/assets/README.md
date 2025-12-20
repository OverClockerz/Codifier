# Assets Folder

## Audio Files

Place your background music files here. Supported formats:
- MP3
- OGG
- WAV

### Required File Structure:
```
/assets/
  /audio/
    lofi-chill.mp3
    corporate-ambient.mp3
    focus-beats.mp3
    calm-office.mp3
    upbeat-workflow.mp3
```

### Track Configuration

The MusicPlayer expects these 5 audio files:

1. **lofi-chill.mp3** 🎧
   - Relaxed coding vibes
   - Lo-fi beats for focused work

2. **corporate-ambient.mp3** 🏢
   - Professional atmosphere
   - Ambient office sounds

3. **focus-beats.mp3** ⚡
   - High productivity energy
   - Upbeat work music

4. **calm-office.mp3** ☕
   - Peaceful work sounds
   - Calm background music

5. **upbeat-workflow.mp3** 🚀
   - Energetic motivation
   - Motivational productivity music

### Recommended Audio Sources

For the Office game, consider these types of background music:
- Lo-fi beats for focused work atmosphere
- Ambient office sounds mixed with calm music
- Corporate elevator music (for comedic effect)
- Upbeat productivity music

### How to Add Custom Tracks

To add or modify tracks, edit the `MUSIC_TRACKS` array in `/components/MusicPlayer.tsx`:

```tsx
const MUSIC_TRACKS = [
  {
    id: 'your-track-id',
    name: 'Your Track Name',
    url: '/assets/audio/your-file.mp3',
    emoji: '🎵',
    description: 'Your track description',
  },
  // ... more tracks
];
```

### Free Music Resources

- **Free Music Archive** - https://freemusicarchive.org/
- **Incompetech** - https://incompetech.com/
- **YouTube Audio Library** - https://www.youtube.com/audiolibrary
- **Bensound** - https://www.bensound.com/
- **Pixabay Music** - https://pixabay.com/music/