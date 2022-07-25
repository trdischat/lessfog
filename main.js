// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { debug } from './module/lib.js';
import { libWrapper } from "./module/shim.js";

CONFIG.LESSFOG = { NOPV: true };

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

    // Determine whether Perfect Vision module is active
    // if (game.modules.get("perfect-vision")?.active) {
    //         CONFIG.LESSFOG.NOPV = false;
    // }

    // Disable sight layer's token vision if GM and option enabled
    if (CONFIG.LESSFOG.NOPV) {
        debug.log(false, 'Token vision button provided by Less Fog module');
        libWrapper.register('lessfog', 'CanvasVisibility.prototype.tokenVision', function (wrapped, ...args) {
            return (game.user.isGM && game.settings.get("lessfog", "showAllToGM")) ? false : wrapped(...args);
        }, 'MIXED');
    } else {
        debug.log(false, 'Token vision button provided by Perfect Vision module');
    }

    // Allow the GM to see all tokens. Disable this option if Levels module is enabled.
    if (game.modules.get("levels")?.active) {
        debug.log(false, 'Levels module enabled; override option to Reveal Tokens to GM');
    } else {
        Hooks.on("sightRefresh", layer => {
            for (let t of canvas.tokens.placeables) {
                t.visible = (!layer.tokenVision && !t.document.hidden) || (game.settings.get("lessfog", "reveal_tokens") && (game.user.isGM || game.settings.get("lessfog", "affect_all"))) || t.isVisible;
            }
        });
    }

});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
    debug.log(true, 'Ready');
});

/* ------------------------------------ */
/* Devmode Hook                         */
/* ------------------------------------ */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag('lessfog');
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
    if (CONFIG.LESSFOG.NOPV) {
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
        layer.filters.push(new PIXI.filters.AlphaFilter(game.settings.get("lessfog", "fog_opacity")));
    }
});
