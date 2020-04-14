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
 * Allow the GM to see all tokens.
 */
SightLayer.prototype.restrictVisibility = function() {

  // Tokens
  for ( let t of canvas.tokens.placeables ) {
    t.visible = ( !this.tokenVision && !t.data.hidden ) || game.user.isGM || t.isVisible;  // ! Changed line
  }

  // Door Icons
  for ( let d of canvas.controls.doors.children ) {
    d.visible = !this.tokenVision || d.isVisible;
  }
}

/**
 * Change scaling of soft shadow blur.
 */
Canvas.prototype.pan = function({x=null, y=null, scale=null}={}) {
  // Pan the canvas to the new destination
  x = Number(x) || this.stage.pivot.x;
  y = Number(y) || this.stage.pivot.y;
  this.stage.pivot.set(x, y);

  // Zoom the canvas to the new level
  if ( Number.isNumeric(scale) && scale !== this.stage.scale.x ) {
    scale = this._constrainScale(scale);
    this.stage.scale.set(scale, scale);
  } else scale = this.stage.scale.x;

  // Update the scene tracked position
  canvas.scene._viewPosition = { x:x , y:y, scale:scale };

  // Call canvasPan Hook
  Hooks.callAll("canvasPan", this, {x, y, scale});

  // Align the HUD
  this.hud.align();

  // Adjust the level of blur as we zoom out
  if ( scale ) {
    canvas.sight.blurDistance = 12 * scale           // ! Changed line
  }
}

/**
 * Increase blur on light tinting.
 */
LightingLayer.prototype._drawLightingContainer = function() {
  const c = new PIXI.Container();
  const d = canvas.dimensions;

  // Define the underlying darkness
  c.darkness = c.addChild(new PIXI.Graphics());

  // Define the overlay lights
  c.lights = c.addChild(new PIXI.Graphics());

  // Apply blur to the lights only
  const bf = new PIXI.filters.BlurFilter(32);        // ! Changed line
  bf.padding = 256;
  if ( game.settings.get("core", "softShadows") ) c.lights.filters = [bf];

  // Apply alpha filter to the parent container
  const af = new PIXI.filters.AlphaFilter(1.0);
  af.blendMode = PIXI.BLEND_MODES.MULTIPLY;
  c.filters = [af];

  // Mask the container by the outer rectangle
  const mask = c.addChild(new PIXI.Graphics());
  mask.beginFill(0xFFFFFF, 1.0).drawRect(0, 0, d.width, d.height).endFill();
  c.mask = mask;
  return c;
}
