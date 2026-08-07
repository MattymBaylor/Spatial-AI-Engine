"""
Export cinematic camera presets from apartment_cinematic.blend into the React app.

Blender is the authoritative art-direction tool. Never hand-edit the generated
JSON or camera values in React -- move the camera in Blender and re-run this.

Usage (headless):
    /Applications/Blender.app/Contents/MacOS/Blender \
        --background "<path>/apartment_cinematic.blend" \
        --online-mode \
        --python tools/blender/export_camera_presets.py

Outputs:
    src/config/camera-presets.json           typed preset data consumed by React
    public/assets/camera-previews/<Name>.png art-direction reference renders

Coordinate handling
-------------------
The runtime GLB (public/assets/apartment/seinfeld_apartment.glb) is a Sketchfab
export whose object space is IDENTICAL to this .blend, wrapped in one root node
applying a Z-up -> Y-up rotation plus a uniform scale.

    three_world = GLB_ROOT_SCALE * (bx, bz, -by)

GLB_ROOT_SCALE is read from the GLB itself so the two can never drift.
"""

from __future__ import annotations

import json
import math
import os
import struct
import sys
from datetime import datetime, timezone

import bpy

CAMERA_COLLECTION = "Cameras_Cinematic"
# The legacy Blender-Internal materials in this file carry no texture nodes, so a
# re-import of the runtime GLB supplies the textured geometry used for previews.
TEXTURED_COLLECTION = "GLB_Textured_Preview"
LEGACY_COLLECTION = "Collection 1"
PREVIEW_RES = (1280, 720)
PREVIEW_EXPOSURE = 1.6  # preview only, restored after. Scene lights are dim.


def repo_root() -> str:
    """Resolve the Spatial-AI-Engine checkout, overridable via SPATIAL_AI_REPO."""
    env = os.environ.get("SPATIAL_AI_REPO")
    if env and os.path.isdir(env):
        return env
    default = os.path.expanduser("~/Desktop/Spatial-AI-Engine")
    if os.path.isdir(default):
        return default
    raise SystemExit("Cannot locate Spatial-AI-Engine. Set SPATIAL_AI_REPO.")


def glb_root_scale(glb_path: str) -> float:
    """Read the uniform scale off the GLB root node so React and Blender agree."""
    with open(glb_path, "rb") as fh:
        data = fh.read()
    if data[:4] != b"glTF":
        raise SystemExit("Not a GLB: %s" % glb_path)
    offset, gltf = 12, None
    while offset < len(data):
        length, chunk_type = struct.unpack_from("<II", data, offset)
        offset += 8
        if chunk_type == 0x4E4F534A:  # JSON chunk
            gltf = json.loads(data[offset : offset + length])
        offset += length
    if gltf is None:
        raise SystemExit("No JSON chunk in %s" % glb_path)
    root = gltf["nodes"][gltf["scenes"][gltf.get("scene", 0)]["nodes"][0]]
    m = root.get("matrix")
    if not m:
        return float(root.get("scale", [1.0])[0])
    return math.sqrt(m[0] ** 2 + m[1] ** 2 + m[2] ** 2)


def to_three(vec, scale: float):
    """Blender Z-up -> three.js Y-up, including the GLB root scale."""
    return [
        round(vec[0] * scale, 6),
        round(vec[2] * scale, 6),
        round(-vec[1] * scale, 6),
    ]


def horizontal_fov_deg(cam_data) -> float:
    """Blender lens -> horizontal FOV (sensor fit AUTO on a landscape render is horizontal)."""
    return math.degrees(2.0 * math.atan((cam_data.sensor_width * 0.5) / cam_data.lens))


def vertical_fov_deg(h_fov_deg: float, aspect: float) -> float:
    h = math.radians(h_fov_deg)
    return math.degrees(2.0 * math.atan(math.tan(h * 0.5) / aspect))


def preset_name(cam) -> str:
    return cam.get("preset") or cam.name.replace("Cam_", "")


def collect_cameras():
    coll = bpy.data.collections.get(CAMERA_COLLECTION)
    if coll is None:
        raise SystemExit("Missing collection '%s' in %s" % (CAMERA_COLLECTION, bpy.data.filepath))
    cams = [o for o in coll.objects if o.type == "CAMERA"]
    if not cams:
        raise SystemExit("No cameras in '%s'" % CAMERA_COLLECTION)
    return sorted(cams, key=lambda o: o.name)


def render_previews(cams, out_dir: str) -> None:
    scene = bpy.context.scene
    os.makedirs(out_dir, exist_ok=True)
    saved = (
        scene.camera,
        scene.render.filepath,
        scene.render.resolution_x,
        scene.render.resolution_y,
        scene.render.resolution_percentage,
        scene.render.image_settings.file_format,
        scene.view_settings.exposure,
    )
    scene.render.resolution_x, scene.render.resolution_y = PREVIEW_RES
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.exposure = PREVIEW_EXPOSURE

    # Render the textured GLB re-import, not the untextured legacy meshes.
    # Both occupy the same coordinate space, so framing is identical either way.
    swapped = []
    textured = bpy.data.collections.get(TEXTURED_COLLECTION)
    legacy = bpy.data.collections.get(LEGACY_COLLECTION)
    if textured is not None and legacy is not None:
        for coll, hide in ((legacy, True), (textured, False)):
            for obj in coll.all_objects:
                if obj.type == "MESH":
                    swapped.append((obj, obj.hide_render))
                    obj.hide_render = hide

    try:
        for cam in cams:
            scene.camera = cam
            scene.render.filepath = os.path.join(out_dir, "%s.png" % preset_name(cam))
            bpy.ops.render.render(write_still=True)
    finally:
        (
            scene.camera,
            scene.render.filepath,
            scene.render.resolution_x,
            scene.render.resolution_y,
            scene.render.resolution_percentage,
            scene.render.image_settings.file_format,
            scene.view_settings.exposure,
        ) = saved
        for obj, was_hidden in swapped:
            obj.hide_render = was_hidden


def build_payload(cams, scale: float, glb_rel: str):
    presets = []
    for cam in cams:
        data = cam.data
        loc = list(cam.matrix_world.translation)
        target = list(cam.get("target", (0.0, 0.0, 0.0)))
        h_fov = horizontal_fov_deg(data)
        name = preset_name(cam)
        presets.append(
            {
                "name": name,
                "blenderObject": cam.name,
                "position": to_three(loc, scale),
                "target": to_three(target, scale),
                "fovHorizontalDeg": round(h_fov, 4),
                "fovVerticalDeg16x9": round(vertical_fov_deg(h_fov, 16.0 / 9.0), 4),
                "near": round(data.clip_start * scale, 6),
                "far": round(data.clip_end * scale, 6),
                "lensMM": round(data.lens, 4),
                "sensorWidthMM": round(data.sensor_width, 4),
                "preview": "/assets/camera-previews/%s.png" % name,
                "blender": {
                    "location": [round(v, 6) for v in loc],
                    "target": [round(v, 6) for v in target],
                    "rotationEulerXYZDeg": [round(math.degrees(v), 4) for v in cam.rotation_euler],
                },
            }
        )
    return {
        "$generated": "DO NOT EDIT BY HAND. Produced by tools/blender/export_camera_presets.py",
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "sourceBlend": bpy.data.filepath,
        "runtimeGlb": glb_rel,
        "glbRootScale": round(scale, 10),
        "coordinateSpace": "three.js world space (Y-up), matching the loaded GLB",
        "conversion": "three = glbRootScale * (blender_x, blender_z, -blender_y)",
        "fovNote": "fovHorizontalDeg is authoritative; derive vertical FOV per canvas aspect at runtime.",
        "presets": presets,
    }


def main() -> None:
    repo = repo_root()
    glb_rel = "public/assets/apartment/seinfeld_apartment.glb"
    scale = glb_root_scale(os.path.join(repo, glb_rel))

    cams = collect_cameras()
    render_previews(cams, os.path.join(repo, "public", "assets", "camera-previews"))

    payload = build_payload(cams, scale, glb_rel)
    out_json = os.path.join(repo, "src", "config", "camera-presets.json")
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)
        fh.write("\n")

    sys.stderr.write(
        "Exported %d presets -> %s (glbRootScale=%.10f)\n" % (len(cams), out_json, scale)
    )


if __name__ == "__main__":
    main()
