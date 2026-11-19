# Platinum Fitness Club Unisex — Malakpet landing page

A standalone, single-page landing site for **Platinum Fitness Club Unisex, New Malakpet, Hyderabad**.

## Live site

**https://platinum-fitness-malakpet.netlify.app**

Hosted free on Netlify. Admin dashboard: https://app.netlify.com/projects/platinum-fitness-malakpet

To publish an update after editing files:

```powershell
cd platinum-malakpet
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
```

`deploy.ps1` reuses the Netlify login already saved on this machine and uploads the current folder. If the session ever expires, run `npx netlify-cli@latest login` once.

## TV display

A dedicated 16:9 screen loop for the gym's TV or reception monitor:

**https://platinum-fitness-malakpet.netlify.app/tv/**

- Five auto-rotating slides, no photos: offer + time-bomb countdown, prices, services, Google reviews, social links + QR
- Scales from 720p to 4K; safe margins for TV overscan
- Live clock with an Open / Closed indicator, offer countdown, and a scannable QR code
- Advances every 13 seconds, reloads itself every 6 hours
- Keyboard control: `→` next, `←` previous, `Space` pause, `F` fullscreen
- `#2` … `#5` in the URL jumps straight to a slide (useful for testing)
- `noindex`, so it never shows up in search results

## TV video (offline / USB)

A rendered MP4 of the same loop, for TVs that play from a USB stick or for sharing on WhatsApp:

- File: `assets/video/platinum-tv-1080p.mp4`
- Direct link: **https://platinum-fitness-malakpet.netlify.app/assets/video/platinum-tv-1080p.mp4**
- 1920×1080 · 30 fps · 42 s · H.264 High · no audio · ~5.5 MB
- Loops seamlessly: dips to black at the end and back in at the start

To play on a TV: copy the file to a USB stick, plug it in, open the TV's media/photos app, select the file and turn on repeat.

The film source used to render it is `tools/film.html` (excluded from the deployed site). Re-rendering needs Chrome + ffmpeg and the frame-capture script.

## Open it

No build step, no dependencies. Just open `index.html` in a browser.

For a local server (recommended if you want the map iframe and fonts to behave exactly like production):

```powershell
# from the project root
npx serve platinum-malakpet
```

## What's inside

```
platinum-malakpet/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/
│       ├── logo.jpg                 # gym logo
│       ├── gym-floor.jpg            # real floor photo
│       ├── gym-transformation.jpg   # member transformation
│       ├── gym-community.jpg        # coaches & members
│       ├── gym-brand-wall.jpg       # Platinum wall
│       └── favicon.svg
└── README.md
```

## Page sections

1. Announcement bar with live daily countdown
2. Sticky header with logo and call CTA
3. Hero with photo collage and member badges
4. Scrolling facility marquee
5. Stats (500+ members, 8,000 sq ft, 4.8 rating, 17 hours)
6. Facilities grid (equipment, trainer, steam, lockers, showers, exercise card, AC)
7. Photo gallery with keyboard-accessible lightbox
8. Anniversary offer (2+2 months at ₹9,499) + big countdown + 10-slot batch
9. Standard rates (₹5,000 / ₹12,000 / ₹17,000 / ₹23,000)
10. ₹500 trial pass (adjusted against membership)
11. Who trains here (IT employees, doctors, professionals, families)
12. Reviews + Justdial rating
13. Location, timings and Google Map
14. FAQ and final CTA
15. Footer with terms, mobile sticky call/WhatsApp bar

## Things to update before going live

- Replace the sample reviews in `index.html` with real, permission-cleared member reviews.
- The anniversary offer countdown resets every night at local midnight by design. If the offer has a fixed end date, change the `tick()` function in `assets/js/main.js` to count down to that date instead.
- The "anniversary batch" progress bar is a visual urgency device. If you want to show real remaining slots, wire the width in `style.css` (`.slots-bar span.is-filled`) and the label in `index.html` to your actual count.
- Set the canonical URL and `og:image` to absolute production URLs.
- Add your privacy policy link in the footer if you collect leads.

## Contact details used

- Phone / WhatsApp: **+91 74167 69922**
- Address: 2nd Floor, Opp. Zudio, Metro Pillar No. 1456, Anand Nagar Colony, New Malakpet, Hyderabad 500036
- Timings: Monday–Saturday, 6:00 AM – 11:00 PM. Sunday closed.
- Terms: one gym entry per day, no transfer, no refund, no freeze.
- Instagram: https://www.instagram.com/platinumfitnessunisex.malakpet/
- YouTube: https://www.youtube.com/@PlatinumFitnessClubUnisex

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses custom properties, `backdrop-filter`, `dialog`, and `IntersectionObserver`. Motion respects `prefers-reduced-motion`.
