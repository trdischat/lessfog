/* Patching and replacement functions from "The Furnace" by KaKaRoTo
* https://github.com/kakaroto/fvtt-module-furnace
*/

const ORIG_PFX = "__trpatch_orig_";

export function patchClass(klass, func, line_number, line, new_line) {
    // Check in case the class/function had been deprecated/removed
    if (func === undefined)
        return;
    let funcStr = func.toString()
    let lines = funcStr.split("\n")
    if (lines[line_number].trim() == line.trim()) {
        lines[line_number] = lines[line_number].replace(line, new_line);
        let fixed = lines.join("\n")
        if (klass !== undefined) {
            let classStr = klass.toString()
            fixed = classStr.replace(funcStr, fixed)
        } else {
            if (!(fixed.startsWith("function") || fixed.startsWith("async function")))
                fixed = "function " + fixed
            if (fixed.startsWith("function async"))
                fixed = fixed.replace("function async", "async function");
        }
        return Function('"use strict";return (' + fixed + ')')();
    } else {
        console.log("Cannot patch function. It has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
    }
};

export function patchFunction(func, line_number, line, new_line) {
    return patchClass(undefined, func, line_number, line, new_line)
};

export function patchMethod(klass, func, line_number, line, new_line) {
    return patchClass(klass, klass.prototype[func], line_number, line, new_line)
};

export function replaceFunction(klass, name, func) {
    klass[ORIG_PFX + name] = klass[name]
    klass[name] = func
};

export function replaceMethod(klass, name, func) {
    return replaceFunction(klass.prototype, name, func)
};

export function replaceStaticGetter(klass, name, func) {
    let getterProperty = Object.getOwnPropertyDescriptor(klass, name);
    if (getterProperty == undefined)
        return false;
    Object.defineProperty(klass, ORIG_PFX + name, getterProperty);
    Object.defineProperty(klass, name, { get: func });
    return true;
};

export function replaceGetter(klass, name, func) {
    return replaceStaticGetter(klass.prototype, name, func)
};

// Would be the same code for callOriginalMethod as long as 'klass' is actually the instance
export function callOriginalFunction(klass, name, ...args) {
    return klass[ORIG_PFX + name].call(klass, ...args)
};

export function callOriginalGetter(klass, name) {
    return klass[ORIG_PFX + name]
};
