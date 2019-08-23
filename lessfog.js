/**
 * Utility function used by patch functions to alter specific lines in a class
 * @param {Class} klass           Class to be patched
 * @param {Function} func         Function in the class to be patched
 * @param {Number} line_number    Line within the function to be patched
 * @param {String} line           Existing text of line to be patched
 * @param {String} new_line       Replacement text for line to be patched
 * @returns {Class}              Revised class
 */
function patchClass(klass, func, line_number, line, new_line) {
  let funcStr = func.toString()
  let lines = funcStr.split("\n")
  if (lines[line_number].trim() == line.trim()) {
    lines[line_number] = lines[line_number].replace(line, new_line);
    classStr = klass.toString()
    fixedClass = classStr.replace(funcStr, lines.join("\n"))
    return Function('"use strict";return (' + fixedClass + ')')();
  }
  else {
    console.log("Function has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
  }
}

/**
 * Patch the SightLayer class to tweak the FOW transparency for the GM,
 * optimize contrast between dim, dark, and unexplored areas, blend dim
 * and bright areas, and let the GM see all tokens on the canvas.
 */
function patchSightLayerClass() {

// Hide unexplored areas from players at all times.
// GM view is half shaded when fogExploration is enabled.
    newClass = patchClass(SightLayer, SightLayer.prototype.draw, 9,
      `if ( game.user.isGM ) this.alphas.unexplored = 0.7;`,
      `this.alphas.unexplored = game.user.isGM ? ( this.fogExploration ? 0.6 : 0.0 ) : 1.0;`);
    if (!newClass) return;
// Reveal previously explored dark areas if fogExploration is true. 
// GM shading calibrated to match setting for unexplored areas.
// dark = 1 - ((1 - 0.6) * (1 - 0.6)) if fogExploration is false.
    newClass = patchClass(newClass, newClass.prototype.draw, 10,
      `if ( !this.fogExploration ) this.alphas.dark = this.alphas.unexplored;`,
      `this.alphas.dark = this.fogExploration ? 0.6 : ( game.user.isGM  ? 0.84 : 1.0 );
      this.alphas.dim = 0.3;`);
    if (!newClass) return;
// Heavily blur edge between bright and dim areas.
    newClass = patchClass(newClass, SightLayer.prototype._drawShadowMap, 6,
      `source.light.mask = source.fov;`,
      `source.light.mask = source.fov;
      if (hex == this.queues.bright.hex) source.filters = game.settings.get("core", "softShadows") ? [new PIXI.filters.BlurFilter(15)] : null;`);
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
