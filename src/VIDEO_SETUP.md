# Video Background Setup

## How to Add Your Video

The landing page now features a scroll-synced video background that plays as users scroll through the page.

### Steps to Add Your Video:

1. **Download the video** from the Gemini link you provided
2. **Add the video file to your project:**
   - Create a `public/video` folder in your project root
   - Place your video file there (e.g., `background.mp4`)

3. **Update the video path** in `/components/LandingPage.tsx`:
   ```tsx
   const videoUrl = '/video/background.mp4'; // Change to your video filename
   ```

### Alternative: Use a Direct URL

If your video is hosted online, you can use a direct URL:
```tsx
const videoUrl = 'https://your-domain.com/path/to/video.mp4';
```

### Video Requirements:

- **Format**: MP4 (recommended for best browser compatibility)
- **Codec**: H.264
- **Audio**: Not required (will be muted automatically)
- **Optimize for web**: Compress the video to reduce file size for better performance

### How It Works:

- The video is **muted** and plays based on scroll position
- Uses **GSAP ScrollTrigger** to sync video playback with scroll progress
- Video is positioned as a **fixed background** behind all content
- Scroll from top to bottom = play video from start to end
- Scroll backwards = video rewinds

### Performance Tips:

1. Keep video file size under 50MB if possible
2. Use web-optimized encoding (H.264)
3. Consider using a lower resolution (720p or 1080p max)
4. Use a video compression tool like HandBrake before uploading
