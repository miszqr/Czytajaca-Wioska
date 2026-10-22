# Continuous fox tail

Date: 2026-10-22

The cream tip was a separate ellipsoid offset above the orange tail. From the
side it looked like an egg resting on the tail.

Kitek and Fela now share a single closed, curved tail mesh with a broad middle
and a tapered tip. Vertex colors join the orange fur to the cream end without
overlapping surfaces. The existing tail joint and wag animation are retained,
as are the character's back-face shadow settings. The mesh has 110 vertices
and 216 triangles.

Verification:

- Exported the actual Babylon character geometry and visually compared old
  and new side views and a new rear three-quarter view using a CPU renderer.
  The detached oval is gone and the cream tip follows the tail's silhouette.
- New tests cover both fox characters: one connected, watertight mesh,
  consistent outward winding/normals, finite vertex data, preserved wag joint
  and shadow metadata, and clearance above the ground.
- `npm run check` passed: 56 tests, content validation, TypeScript, production
  build and production module startup.
- Visual inspection used exported geometry, not a WebGL gameplay capture.
  The existing automated shadow tests also pass.
