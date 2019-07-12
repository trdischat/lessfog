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

function patchSightLayerClass() {
    oldDraw = SightLayer.prototype.draw.toString()
    oldRestrictVisibility = SightLayer.prototype.restrictVisibility.toString()
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
//    console.log("Changed function : \n", oldDraw, "\nInto : \n", SightLayer.prototype.draw.toString())
//    console.log("Changed function : \n", oldRestrictVisibility, "\nInto : \n", SightLayer.prototype.restrictVisibility.toString())
}

patchSightLayerClass()
