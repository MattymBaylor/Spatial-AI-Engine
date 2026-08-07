# Camera pipeline — Blender is the single source of truth

Camera data flows in exactly one direction:

```
apartment_cinematic.blend  →  export_camera_presets.py  →  src/config/camera-presets.json  →  runtime
```

**Never edit camera coordinates in React.** `npm run build` will fail if you do.

## Files

| Path | Role |
|---|---|
| `~/Downloads/seinfeld-apartment 2/source/apartment_cinematic.blend` | Authoritative. All shots live in the `Cameras_Cinematic` collection. |
| `tools/blender/export_camera_presets.py` | The only thing allowed to write preset data. |
| `src/config/camera-presets.json` | Generated. Committed. Do not hand-edit. |
| `public/assets/camera-previews/*.png` | Generated reference renders, used as picker thumbnails. |
| `src/config/cameraPresets.ts` | Thin typed adapter. Contains no coordinates. |
| `tools/verify-camera-presets.mjs` | Enforces the contract. Runs on every build. |

## Changing a shot

1. Open the .blend, move/aim the camera in the `Cameras_Cinematic` collection.
2. Update its `target` custom property to the new focal point (the exporter reads it).
3. `npm run cameras:export`
4. `npm run cameras:verify`
5. Commit the regenerated JSON **and** the preview renders together.

## Adding a shot

Name the camera `Cam_<Name>`, put it in `Cameras_Cinematic`, give it a `target`
custom property, then add `<Name>` to `CAMERA_PRESET_NAMES` in `src/types/scene.ts`.
The verifier fails if those two ever disagree.

## Coordinate contract

The runtime GLB is a Sketchfab export whose object space is identical to the
.blend, wrapped in one root node applying Z-up → Y-up plus a uniform scale.

```
three_world = glbRootScale * (blender_x, blender_z, -blender_y)
```

`glbRootScale` is read out of the GLB at export time and re-checked at verify
time, so the two can never silently drift. If you ever swap the GLB, re-run the
exporter — the verifier will fail until you do.

## FOV contract

Blender exports **horizontal** FOV. three.js wants vertical, which depends on
canvas aspect. `verticalFovForAspect()` converts at runtime, so the horizontal
framing always matches the reference renders regardless of window size.

## Why previews render the GLB, not the .blend meshes

The source .blend is a legacy Blender-Internal file. Its 75 materials are
node-based but contain **zero image-texture nodes** — the 65 texture datablocks
were wired through `Material.texture_slots`, an API Blender removed. Nothing
reconnects them, and only 31 of 75 materials share a name with their texture, so
the mapping cannot be reconstructed reliably.

Net effect: the original meshes render completely untextured.

The fix is to render the runtime GLB instead, which has correct, fully-wired
materials. It is re-imported into the collection `GLB_Textured_Preview` with its
root scale set back to `1.0`, which lands it in exactly the same coordinate space
as the legacy meshes — so camera framing is identical either way. The exporter
swaps `hide_render` between the two collections around the render and restores
it afterwards.

The legacy meshes are kept (hidden) as the provenance of the camera coordinates.
**Do not delete them.**

### Texture links (repaired)

62 of 68 image paths now resolve. 30 were repaired: 29 `.jpg` vs `.jpeg`
extension mismatches plus 1 wrong directory.

Six remain unresolvable — absent from the source zip, the textures folder, and
recoverable names in the GLB. Four of them have **zero users** and are inert:

| Image | Users | Note |
| --- | --- | --- |
| `BrickSmallBrown0264_1_S.jpg` | 0 | absolute path to the original author's machine |
| `flowerpainting.jpg` | 0 | inert |
| `outside.jpg` | 0 | inert |
| `pw.jpg` | 0 | inert |
| `paneling.jpg` | 1 | only `paneling_NRM.png` (normal map) shipped |
| `window_cookie2.jpg` | 1 | inert in practice — legacy slots are disconnected |

None affect the runtime, which uses the GLB's embedded textures.
