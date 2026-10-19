export const CONFIG = {
  worldHalfSize: 49, playerRadius: .28,
  walkSpeed: 2.4, runSpeed: 4, accelerationSeconds: .2,
  turnSpeed: Math.PI * 3, interactionRadius: 2,
  keyboardTurnSpeed: Math.PI * .8, cameraFollowSpeed: 10,
  cameraDistance: 3.5, cameraTargetHeight: 1,
  cameraMinPitch: .12, cameraMaxPitch: .85,
  cameraMinDistance: 2.3, cameraMaxDistance: 6,
  spawn: {x:0,z:-5,heading:0},
} as const;
