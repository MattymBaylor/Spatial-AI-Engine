#!/usr/bin/env node
/**
 * Guards the one-way camera pipeline:
 *
 *   Blender -> exporter -> camera-presets.json -> runtime
 *
 * Fails the build if the generated data drifts from what the runtime expects,
 * or if someone hand-authored camera coordinates in TypeScript.
 *
 *   node tools/verify-camera-presets.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = dirname(dirname(fileURLToPath(import.meta.url)))
const errors = []
const warn = []

const jsonPath = join(repo, 'src/config/camera-presets.json')
if (!existsSync(jsonPath)) {
  console.error('MISSING src/config/camera-presets.json — run the Blender exporter.')
  process.exit(1)
}
const data = JSON.parse(readFileSync(jsonPath, 'utf8'))

// 1. Every name the runtime types declare must exist in the generated file.
const sceneTypes = readFileSync(join(repo, 'src/types/scene.ts'), 'utf8')
const declared = [...sceneTypes.matchAll(/^\s*'([A-Za-z]+)',$/gm)].map((m) => m[1])
const generated = new Set(data.presets.map((p) => p.name))
for (const name of declared) {
  if (!generated.has(name)) errors.push(`camera-presets.json is missing preset "${name}"`)
}
for (const p of data.presets) {
  if (!declared.includes(p.name)) warn.push(`generated preset "${p.name}" has no CameraPresetName`)
}

// 2. The exported scale must still match the runtime GLB's root node.
const glb = readFileSync(join(repo, data.runtimeGlb))
const jsonLen = glb.readUInt32LE(12)
const gltf = JSON.parse(glb.subarray(20, 20 + jsonLen).toString('utf8'))
const root = gltf.nodes[gltf.scenes[gltf.scene ?? 0].nodes[0]]
const m = root.matrix
const liveScale = Math.hypot(m[0], m[1], m[2])
if (Math.abs(liveScale - data.glbRootScale) > 1e-9) {
  errors.push(
    `glbRootScale drift: json=${data.glbRootScale} glb=${liveScale}. Re-run the exporter.`,
  )
}

// 3. Preview render must exist for every shot.
for (const p of data.presets) {
  if (!existsSync(join(repo, 'public', p.preview))) {
    errors.push(`missing preview render for "${p.name}" at public${p.preview}`)
  }
}

// 4. No hand-authored camera coordinates anywhere in src.
const OFFENDER = /\b(position|target)\s*:\s*\[\s*-?\d/
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
for (const file of walk(join(repo, 'src')).filter((f) => /\.tsx?$/.test(f))) {
  const src = readFileSync(file, 'utf8')
  src.split('\n').forEach((line, i) => {
    if (OFFENDER.test(line)) {
      errors.push(
        `${file.replace(repo + '/', '')}:${i + 1} hardcoded camera vector — ` +
          'camera data must come from camera-presets.json',
      )
    }
  })
}

for (const w of warn) console.warn('warn:', w)
if (errors.length) {
  console.error('\nCamera pipeline check FAILED:')
  for (const e of errors) console.error('  -', e)
  process.exit(1)
}
console.log(
  `Camera pipeline OK — ${data.presets.length} presets, scale ${data.glbRootScale}, generated ${data.generatedAt}`,
)
