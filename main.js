// Import JavaScript modules
import { loadSettings, registerSettings, settings } from './module/settings.js';
import { debug } from './module/lib.js';
import { libWrapper } from "./module/shim.js";

CONFIG.LESSFOG = { addTokenVisionButton: true };

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    debug.log(true, 'Initializing');

    // Register custom module settings
    registerSettings();

});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
    debug.log(true, 'Setup');

    loadSettings();

    // PF2E game system provides token vision button
    if (game.system.id === "pf2e") {
        CONFIG.LESSFOG.addTokenVisionButton = false;
        debug.log(false, 'Token vision button provided by PF2e game system');
    }

    // Disable sight layer's token vision if GM and option enabled
    if (CONFIG.LESSFOG.addTokenVisionButton) {
        debug.log(false, 'Token vision button provided by Less Fog module');
        libWrapper.register('lessfog', 'CanvasVisibility.prototype.tokenVision', function (wrapped, ...args) {
            let result = wrapped(...args);
            return (game.user.isGM && settings.showAllToGM) ? false : result;
        }, 'MIXED', { perf_mode: 'FAST' });
    }

    // Allow the GM to see all tokens. Disable this option if Levels module is enabled.
    if (game.modules.get("levels")?.active) {
        debug.log(false, 'Levels module enabled; override option to Reveal Tokens to GM');
    } else {
        libWrapper.register('lessfog', 'Token.prototype.isVisible', function (wrapped, ...args) {
            let result = wrapped(...args);
            return (settings.reveal_tokens && (game.user.isGM || settings.affect_all)) ? true : result;
        }, 'MIXED', { perf_mode: 'FAST' });
    }
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
    debug.log(true, 'Ready');
});

/* ------------------------------------ */
/* When Canvas is ready					*/
/* ------------------------------------ */
Hooks.once('canvasReady', function () {
})

/* ------------------------------------ */
/* Additional Hooks                     */
/* ------------------------------------ */

Hooks.on('getSceneControlButtons', controls => {
    if (CONFIG.LESSFOG.addTokenVisionButton) {
        let tokenButton = controls.find(b => b.name == "token")
        if (tokenButton) {
            tokenButton.tools.push({
                name: "vision",
                title: "Toggle GM Vision",
                icon: "far fa-eye-slash",
                toggle: true,
                active: game.settings.get("lessfog", "showAllToGM"),
                visible: game.user.isGM,
                onClick: (value) => game.settings.set("lessfog", "showAllToGM", value)
            });
        }
    }
});

Hooks.on("drawCanvasVisibility", layer => {
    if (game.user.isGM || game.settings.get("lessfog", "affect_all")) {
        debug.log(false,'Add alpha filter to fog layer');
        layer.filters.push(new PIXI.AlphaFilter(game.settings.get("lessfog", "fog_opacity")));
    }
});
