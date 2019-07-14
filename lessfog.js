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
    return  eval ("(" + fixedClass + ")")
    } else {
        console.log("Function has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
    }
}

/**
 * Patch SightLayer class to allow GM to see through the FOW and to see all tokens on the canvas
 */
function patchSightLayerClass() {
    newClass = patchClass(SightLayer, SightLayer.prototype.draw, 8,
      "unexplored: 1.0,",
      "unexplored: game.user.isGM ? ( this.fogExploration ? 0.5 : 0.0 ) : 1.0,");
    if (!newClass) return;
    newClass = patchClass(newClass, newClass.prototype.draw, 9,
      "dark: this.fogExploration ? 0.75 : 1.0,",
      "dark: ( this.fogExploration || game.user.isGM ) ? 0.7 : 1.0,");
    if (!newClass) return;
    newClass = patchClass(newClass, SightLayer.prototype.restrictVisibility, 2,
      "// Tokens",
      `if ( !game.user.isGM )
       // Tokens`);
    if (!newClass) return;
    SightLayer = newClass
}

patchSightLayerClass()
