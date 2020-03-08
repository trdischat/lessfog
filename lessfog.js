/**
 * Utility function used by patch functions to alter specific lines in a class
 * @param {Class} klass           Class to be patched
 * @param {Function} func         Function in the class to be patched
 * @param {Number} line_number    Line within the function to be patched
 * @param {String} line           Existing text of line to be patched
 * @param {String} new_line       Replacement text for line to be patched
 * @returns {Class}               Revised class
 */
function patchClass(klass, func, line_number, line, new_line) {
  let funcStr = func.toString()
  let lines = funcStr.split("\n")
  if (lines[line_number].trim() == line.trim()) {
    lines[line_number] = lines[line_number].replace(line, new_line);
    classStr = klass.toString()
    fixedClass = classStr.replace(funcStr, function(m) {return lines.join("\n")})
    return Function('"use strict";return (' + fixedClass + ')')();
  }
  else {
    console.log("Function has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
  }
}

/**
 * Patch the SightLayer class to tweak the FOW transparency for the GM,
 * optimize contrast between bright, dim, dark, explored, and unexplored areas, 
 * and let the GM see all tokens on the canvas.
 */
function patchSightLayerClass() {
  // Modify default alphas.
  newClass = patchClass(SightLayer, SightLayer.prototype._configureChannels, 4,
    `black: { alpha: 1.0 },`,
    `black: { alpha: game.user.isGM ? 0.88 : 1.0 },`);
  if (!newClass) return;
  newClass = patchClass(newClass, newClass.prototype._configureChannels, 5,
    `explored: { alpha: 0.9 },`,
    `explored: { alpha: 0.76 },`);
  if (!newClass) return;
  newClass = patchClass(newClass, newClass.prototype._configureChannels, 6,
    `dark: { alpha: 0.7 },`,
    `dark: { alpha: 0.6 },`);
  if (!newClass) return;
  newClass = patchClass(newClass, newClass.prototype._configureChannels, 7,
    `dim: { alpha: 0.5 },`,
    `dim: { alpha: 0.4 },`);
  if (!newClass) return;
  // Reveal all tokens to the GM. 
  newClass = patchClass(newClass, SightLayer.prototype.restrictVisibility, 2,
    "// Tokens",
    `// Tokens
    if ( !game.user.isGM )`);
  if (!newClass) return;
  SightLayer = newClass
}
  
if (patchedSightLayerClass == undefined) {
  patchSightLayerClass();
  var patchedSightLayerClass = true;
}

/**
 * Patch the Canvas class to increase soft shadow blur.
 */
function patchCanvasClass() {
  newClass = patchClass(Canvas, Canvas.prototype.pan, 24,
    `canvas.sight.blurDistance = 20 / (CONFIG.Canvas.maxZoom - Math.round(scale) + 1)`,
    `canvas.sight.blurDistance = 60 / (CONFIG.Canvas.maxZoom - Math.round(scale) + 1)`);
  if (!newClass) return;
  Canvas = newClass
}
  
if (patchedCanvasClass == undefined) {
  patchCanvasClass();
  var patchedCanvasClass = true;
}  

/**
 * Patch the LightingLayer class to increase blur on light tinting.
 */
function patchLightingLayerClass() {
  newClass = patchClass(LightingLayer, LightingLayer.prototype._drawLightingContainer, 11,
    `const bf = new PIXI.filters.BlurFilter(16);`,
    `const bf = new PIXI.filters.BlurFilter(32);`);
  if (!newClass) return;
  LightingLayer = newClass
}

if (patchedLightingLayerClass == undefined) {
  patchLightingLayerClass();
  var patchedLightingLayerClass = true;
}
