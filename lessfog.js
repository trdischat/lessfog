/**
 * Configuration for dim, dark, explored, and unexplored settings.
 */
Hooks.once("init", function() {
  game.settings.register("lessfog", "alpha_unexplored", {
    name: "Unexplored",
    hint: "Darkness in unexplored areas (GM only)",
    scope: "world",
    type: Number,
    default: 0.85,
    config: true,
    onChange: s => {canvas.draw();}
  });
  game.settings.register("lessfog", "alpha_explored", {
    name: "Explored",
    hint: "Darkness in explored areas",
    scope: "world",
    type: Number,
    default: 0.75,
    config: true,
    onChange: s => {canvas.draw();}
  });
  game.settings.register("lessfog", "alpha_dark", {
    name: "Dark",
    hint: "Darkness in dark areas (not used)",
    scope: "world",
    type: Number,
    default: 0.6,
    config: true,
    onChange: s => {canvas.draw();}
  });
  game.settings.register("lessfog", "alpha_dim", {
    name: "Dim",
    hint: "Darkness in dim areas",
    scope: "world",
    type: Number,
    default: 0.4,
    config: true,
    onChange: s => {canvas.draw();}
  });
});

/**
 * Adjust the FOW transparency for the GM, and optimize contrast
 * between bright, dim, dark, explored, and unexplored areas.
 */
SightLayer.prototype._configureChannels = function() {
  // Set up the default channel order and alphas (with no darkness)
  const channels = {
    black: { alpha: game.user.isGM ? game.settings.get("lessfog", "alpha_unexplored") : 1.0 },   // ! Changed line
    explored: { alpha: game.settings.get("lessfog", "alpha_explored") },                         // ! Changed line
    dark: { alpha: game.settings.get("lessfog", "alpha_dark") },                                 // ! Changed line
    dim: { alpha: game.settings.get("lessfog", "alpha_dim") },                                   // ! Changed line
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
