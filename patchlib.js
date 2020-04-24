if (typeof trPatchLib !== 'function') {
    trPatchLib = class {
        /* Patching and replacement functions from "The Furnace" by KaKaRoTo
        * https://github.com/kakaroto/fvtt-module-furnace
        */
        static patchClass(klass, func, line_number, line, new_line) {
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
                    if (!fixed.startsWith("function"))
                        fixed = "function " + fixed
                    if (fixed.startsWith("function async"))
                        fixed = fixed.replace("function async", "async function");
                }
                return Function('"use strict";return (' + fixed + ')')();
            } else {
                console.log("Cannot patch function. It has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
            }
        }

        static patchFunction(func, line_number, line, new_line) {
            return this.patchClass(undefined, func, line_number, line, new_line)
        }

        static patchMethod(klass, func, line_number, line, new_line) {
            return this.patchClass(klass, klass.prototype[func], line_number, line, new_line)
        }

        static replaceFunction(klass, name, func) {
            klass[this.ORIG_PFX + name] = klass[name]
            klass[name] = func
        }

        static replaceMethod(klass, name, func) {
            return this.replaceFunction(klass.prototype, name, func)
        }

        static replaceStaticGetter(klass, name, func) {
            let getterProperty = Object.getOwnPropertyDescriptor(klass, name);
            if (getterProperty == undefined)
                return false;
            Object.defineProperty(klass, this.ORIG_PFX + name, getterProperty);
            Object.defineProperty(klass, name, { get: func });
            return true;
        }

        static replaceGetter(klass, name, func) {
            return this.replaceStaticGetter(klass.prototype, name, func)
        };

        // Would be the same code for callOriginalMethod as long as 'klass' is actually the instance
        static callOriginalFunction(klass, name, ...args) {
            return klass[this.ORIG_PFX + name].call(klass, ...args)
        }

        static callOriginalGetter(klass, name) {
            return klass[this.ORIG_PFX + name]
        }

        static init() {
        }
    }

    trPatchLib.ORIG_PFX = "__trpatch_orig_";
    Hooks.once('init', trPatchLib.init);
} 
