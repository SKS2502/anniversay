# Our Story

A personal, static 3D anniversary experience built with Vite and Three.js.

## Run locally

```sh
npm install
npm run dev
```

## Current milestone

The current milestone includes a cinematic welcome screen and a circular,
ivory-colored Three.js memory gallery with curved architecture, a skylight,
five sections, sixteen configurable photo frames, and a circular anniversary
focal display. An interlocking gold-and-rose heart sculpture sits at the
center, with four gold easel letter stands arranged in a ring around it.
Twelve colorful ceramic planters with flowers and foliage soften the walking
areas without blocking the circular route. Edit the letter headings and
messages in `src/config/gallery.js`. Press **Enter our world**,
then use **W/A/S/D** or the arrow keys to move around.
The sixteen personal photos are loaded into their frames as you enter. The
background track is `public/audio/background.mp3`; it starts from the welcome
button click and can be muted or resumed with the music control.
The 3D scene is loaded only when you enter.
Movement is camera-relative and eases into and out of motion. Click the scene
to capture the mouse and orbit the camera; press **Esc** to release it. Vertical
camera rotation is clamped. The GLB avatar and audio are intentionally left for
later milestones. Sixteen editable memory examples are configured in
`src/config/memories.js`; replace their titles, messages, optional dates, and
photo paths. The current sixteen photos are stored in `public/photos` and
mapped to frames in filename order. Approach a frame and press **E** on
desktop, or tap a frame on mobile, to open it. Approach the circular focal
display and press **E** to open the anniversary finale. Edit the introduction and finale copy in
`src/config/experience.js`. Pause with **Esc**, **P**, or the top-right button.
On touch devices, use the on-screen joystick to move and drag on the right half
of the screen to orbit the camera.

Create production files with `npm run build`.
