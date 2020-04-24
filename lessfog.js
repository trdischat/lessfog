/**
 * Adjust the FOW transparency for the GM, and optimize contrast
 * between bright, dim, dark, explored, and unexplored areas.
 */
SightLayer.prototype._configureChannels = function() {
  // Set up the default channel order and alphas (with no darkness)
  const channels = {
    black: { alpha: game.user.isGM ? 0.88 : 1.0 },   // ! Changed line
    explored: { alpha: 0.76 },                       // ! Changed line
    dark: { alpha: 0.6 },                            // ! Changed line
    dim: { alpha: 0.4 },                             // ! Changed line
    bright: { alpha: 0.0 }
  };

  // Modify alpha levels for darkness value and compute hex code
  for ( let c of Object.values(channels) ) {
    c.hex = PIXI.utils.rgb2hex([c.alpha, c.alpha, c.alpha]);
  }
  return channels;
}

/**
 * Patch functions.
 */
Hooks.once("ready", function() {
  // Allow the GM to see all tokens.
  let newClass = SightLayer;
  newClass = trPatchLib.patchMethod(newClass, "restrictVisibility", 4,
    `t.visible = ( !this.tokenVision && !t.data.hidden ) || t.isVisible;`,
    `t.visible = ( !this.tokenVision && !t.data.hidden ) || game.user.isGM || t.isVisible;`);
  if (!newClass) return;
  SightLayer.prototype.restrictVisibility = newClass.prototype.restrictVisibility;
  // Change scaling of soft shadow blur.
  newClass = Canvas;
  newClass = trPatchLib.patchMethod(newClass, "pan", 24,
    `canvas.sight.blurDistance = 20 / (CONFIG.Canvas.maxZoom - Math.round(scale) + 1)`,
    `canvas.sight.blurDistance = 12 * scale`);
  if (!newClass) return;
  Canvas.prototype.pan = newClass.prototype.pan;
  // Increase blur on light tinting.
  newClass = LightingLayer;
  newClass = trPatchLib.patchMethod(newClass, "_drawLightingContainer", 13,
    `const bf = new PIXI.filters.BlurFilter(16);`,
    `const bf = new PIXI.filters.BlurFilter(32);`);
  if (!newClass) return;
  LightingLayer.prototype._drawLightingContainer = newClass.prototype._drawLightingContainer;
});
