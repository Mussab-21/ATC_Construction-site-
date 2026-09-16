# Blueprint -> 3D hero animation — how to apply and use

## 1. Apply the patch

```bash
cd ATC_Construction-site-        # your local clone
git checkout -b hero-3d
git am < atc-blueprint-to-3d.patch
```

If `git am` complains, use `git apply atc-blueprint-to-3d.patch` instead.

## 2. What happens now, with zero extra work

Open `index.html` (via `python3 -m http.server 8000`, same as before — don't
open the file directly with `file://`, WebGL/module loading needs an actual
server). The hero will:

1. Draw the blueprint in, like before.
2. Hold on "ELEVATION COMPILED."
3. Crossfade into a rotating 3D building — a simple placeholder made of
   boxes, roof and windows, styled in your brand colours. This is NOT your
   Tripo3D model yet — see step 3.
4. Hold, rotating slowly, for ~4 seconds.
5. Crossfade back to the blueprint, which retracts and redraws. Repeats
   forever.

## 3. Plug in your real Tripo3D model

This is the only manual step:

1. In **Tripo3D Studio**, once you're happy with the generated building,
   export it as **GLB** — not OBJ or FBX. GLB keeps textures and materials
   bundled in a single file, which is what the browser needs.
2. Rename the downloaded file to exactly: `atc-building.glb`
3. Drop it into: `assests/models/atc-building.glb`
   (matches the repo's existing "assests" spelling — don't create a
   correctly-spelled `assets/` folder, the code won't find it there)
4. Refresh the page. No code changes needed — the script auto-detects the
   file and swaps the placeholder for your real model on load. The status
   badge will read "3D MODEL — LIVE VIEW" instead of "3D MODEL — PLACEHOLDER"
   once it's picked up your file, so you'll know it worked.

## Tuning

All timing lives at the top of `js/hero-animation.js`:

```js
var TIMING = {
  holdOnBlueprint: 1100,   // pause after blueprint finishes drawing
  crossfade: 650,          // fade duration each direction
  holdOn3D: 4200,          // how long the 3D model stays visible
  retractStagger: 20,
};
```

Rotation speed is one line in `js/hero-3d.js`, inside `_tick()`:
```js
this._modelGroup.rotation.y += 0.0065;   // increase for faster spin
```

## If the model looks too big/small/off-center on load

The loader auto-fits and auto-centers any GLB it finds (`_fitModel()` in
`hero-3d.js`), so most Tripo3D exports should look reasonable out of the
box. If yours doesn't, the two things to adjust are in `init()`:
- `camera.position.set(4.2, 3.2, 5.4)` — move the camera further/closer
- the `3.2` in `_fitModel`'s `var scale = 3.2 / maxDim;` — the target size
  the model gets scaled to

## Note on the CDN

Three.js loads from jsdelivr (`cdn.jsdelivr.net`), pinned to r0.128 — an
older, stable, non-module build that works with plain `<script>` tags (no
bundler needed, matching the rest of this site). If your production host
blocks that CDN, download `three.min.js` and `GLTFLoader.js` and serve them
from your own `/js/vendor/` folder instead, then update the two `<script
src="...">` lines in `index.html` to point at the local copies.
