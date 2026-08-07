# Seinfeld Spatial AI Engine — State of Play

_Last updated: 2026-08-06_

## Vision

A spatial AI world built around Jerry's apartment and Monk's Café. The space is not merely scenery: each location changes how the agents behave.

- **Jerry's apartment:** execution, standups, incoming events, tools, and operational work.
- **Monk's Café:** strategy, debate, reflection, and breaking down decisions.

Long-term, the characters become clickable AI agents with voice, shared memory, overlapping conversation, ambient behavior, and code-word-triggered scenes.

## Source and branches

- Repository: `MattymBaylor/Spatial-AI-Engine`
- Working branch: `agent/mission-control-v0-1`
- The polished Mission Control UI originally lived outside the repository at:
  `~/Downloads/seinfeld-ai-simulation-v01/index.html`
- Standalone Mission Control v0.2 adds an Apartment / Monk's Café switch using Sketchfab embeds.

## Current technical state

### React / Three.js build

- Local folder: `~/Desktop/Spatial-AI-Engine`
- Vite-based React/Three.js scene foundation.
- Blender-exported camera presets and preview renders are committed.
- Apartment currently shown as a clay/untextured build during testing.
- Original free camera behavior was restored after a constrained-camera experiment felt worse.
- **Decision:** do not change the camera again for now.

### Standalone Mission Control prototype

- Lightweight HTML proof of concept.
- Apartment Sketchfab model ID: `fd8abc336560446f9714dfe7076295b9`
- Monk's Café Sketchfab model ID: `a8a63c9a7f7f45bb8bd1798856c4c22d`
- Both models are credited to kagley and listed as CC Attribution.
- v0.2 includes a location switch plus location-specific labels and canned dialogue.
- No backend or live AI connection yet.

## Character work

### Kramer

- A stylized polygonal Kramer character is being modeled and rigged separately.
- Blender work is in progress on his signature slide through Jerry's front door.
- No export is needed until the animation looks right.
- Final desired web asset:
  - `public/assets/characters/kramer.glb`
  - Embedded textures
  - Rig preserved
  - Origin at feet
  - Same world scale as apartment
  - Named animation clip: `Entrance`
  - Optional clips: `Idle`, `Exit`

### Elaine

- An Elaine character asset exists and may be integrated later.

### Other characters

- Animation is not required for the conversational MVP.
- Static portraits or markers are sufficient initially.

## Next product milestone: clickable conversations

Priority is interaction, not animation.

1. Click Jerry, Elaine, George, or Kramer.
2. Open a conversation panel.
3. Type or use a microphone.
4. The selected character answers with its own role, personality, and memory.
5. **Ask Everyone** starts a group discussion at Monk's.

A small backend must hold the model API key securely. The same underlying model can power all characters; differentiation comes from prompts, roles, memory, and routing.

## Proposed LangGraph design

- Shared conversation state and memory.
- One character node per persona.
- Parallel reasoning and controlled interruptions.
- An audio-floor manager governs overlapping speech, yielding, ducking, and silence.
- Location changes the operating prompt:
  - Apartment = execution mode
  - Monk's = strategy mode
- A **SERENITY NOW** control immediately stops all voices.

Character lenses:

- **Jerry:** contradiction, clarity, and the real question.
- **Elaine:** practical judgment, customer/market reality, and weak assumptions.
- **George:** risk, failure modes, and uncomfortable objections.
- **Kramer:** unconventional possibilities and high-novelty ideas.

## Ambient behavior system

A separate ambient director should make the world feel alive without interrupting constantly.

Examples:

- Kramer enters, steals food, and leaves.
- George checks the answering machine.
- Elaine passes through and mutters something.
- Newman appears in the hallway doing something suspicious.
- The phone rings and nobody answers.
- Kramer returns partially eaten food.

Ambient events should be rare and unpredictable. Conversation keywords can raise their probability: “mail” may summon Newman; “food” may send Kramer to the refrigerator.

## Code-word scenes

A scene registry can temporarily interrupt live conversation, run choreography, then return to the AI discussion.

Potential triggers:

- `Vandelay Industries` — George's unemployment/latex-salesman scene.
- `Serenity now`
- `These pretzels`
- `Marine biologist`
- `The contest`
- `Newman`

Initial versions can use dialogue, audio, camera changes, and static poses before full animation exists.

## Audio assets discussed

- “Hey, buddy” clip: approximately 1.75 seconds.
- Bass sting: approximately 2.06 seconds.
- Intended Kramer event sequence:
  1. Camera turns toward front door.
  2. Door opens.
  3. Kramer slides in.
  4. “Hey, buddy” plays.
  5. Bass sting lands.
  6. Mission Control logs the event.

Browser audio begins only after a user interaction, so the Kramer/location button can safely trigger it.

## Monk's source package

The supplied Monk's archive includes:

- `monk's.blend`
- Texture files
- No exported GLB/GLTF

The standalone prototype does not need the GLB because it uses Sketchfab. The React/Three.js version will require an optimized `monks.glb` with embedded textures.

## Important decisions

- Preserve the original camera behavior.
- Do not block conversational AI on character animation.
- Monk's is the strategy room; the apartment is the execution room.
- Build clickable character conversations before polishing movement.
- Treat Kramer animation, ambient behaviors, and reenactments as later layers.
- The repository stays independent for now; branding/domain decisions are deferred.
