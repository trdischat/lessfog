// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { patchMethod } from './module/patchlib.js';

/**
 * 0.7.5 Specific
 * Set unexplored fog alpha for GMs only.
 * Setting the color should be sufficient but is bugged.
 * Issue: https://gitlab.com/foundrynet/foundryvtt/-/issues/3955
 * @param {number} unexploredDarkness - number between 0 and 1
 */
export function setUnexploredForGM(unexploredDarkness) {
    if (game.user.isGM) {
        // canvas.sight.refresh() should be applying the new color but isn't - https://gitlab.com/foundrynet/foundryvtt/-/issues/3955
        // CONFIG.Canvas.unexploredColor = PIXI.utils.rgb2hex([unexploredDarkness, unexploredDarkness, unexploredDarkness]);
        // canvas.sight.refresh();

        // instead we set the alpha of the `unexlored` container
        canvas.sight.fog.unexplored.alpha = 1 - unexploredDarkness;
    }
}

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('lessfog | Initializing lessfog');

    // Register custom module settings
    registerSettings();

    if (isNewerVersion('0.7.3', game.data.version)) {
        /**
         * 0.6.6 Specific
         * Adjust the FOW transparency for the GM, and optimize contrast
         * between bright, dim, dark, explored, and unexplored areas.
         */

        SightLayer.prototype._configureChannels = function () {
            // Set up the default channel order and alphas (with no darkness)
            const channels = {
                black: { alpha: game.user.isGM ? game.settings.get("lessfog", "alpha_unexplored") : 1.0 },   // ! Changed line
                explored: { alpha: game.settings.get("lessfog", "alpha_explored") },                         // ! Changed line
                dark: { alpha: game.settings.get("lessfog", "alpha_dark") },                                 // ! Changed line
                dim: { alpha: game.settings.get("lessfog", "alpha_dim") },                                   // ! Changed line
                bright: { alpha: 0.0 }
            };
            // Modify alpha levels for darkness value and compute hex code
            for (let c of Object.values(channels)) {
                c.hex = PIXI.utils.rgb2hex([c.alpha, c.alpha, c.alpha]);
            }
            return channels;
        }
    } else {
        /**
         * 0.7.5 Specific
         * Adjust the dim light level and the explored darkness color
         */

        // set the dim light level
        CONFIG.Canvas.lightLevels.dim = game.settings.get("lessfog", "level_dim");

        // set the explored color based on selected darkness level
        const exploredDarkness = game.settings.get("lessfog", "explored_darkness");

        CONFIG.Canvas.exploredColor = PIXI.utils.rgb2hex([exploredDarkness, exploredDarkness, exploredDarkness]);
    }
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {

    /**
     * Patch `restrictVisibility` to allow the GM to see all tokens.
     */
    let newClass = SightLayer;
    newClass = patchMethod(newClass, "restrictVisibility", 4,
        `t.visible = ( !this.tokenVision && !t.data.hidden ) || t.isVisible;`,
        `t.visible = ( !this.tokenVision && !t.data.hidden ) || ( game.settings.get("lessfog", "reveal_tokens") && game.user.isGM ) || t.isVisible;`);
    if (!newClass) return;
    SightLayer.prototype.restrictVisibility = newClass.prototype.restrictVisibility;


    /**
     * 0.6.6 Specific
     * Fix blur scaling with pan/zoom.
     */
    if (isNewerVersion('0.7.3', game.data.version)) {
        // Change scaling of soft shadow blur.
        newClass = Canvas;
        newClass = patchMethod(newClass, "pan", 12,
            `this.sight.blurDistance = 20 / (CONFIG.Canvas.maxZoom - Math.round(constrained.scale) + 1);`,
            `this.sight.blurDistance = 12 * constrained.scale;`);
        if (!newClass) return;
        Canvas.prototype.pan = newClass.prototype.pan;
        // Increase blur on light tinting.
        newClass = LightingLayer;
        newClass = patchMethod(newClass, "_drawLightingContainer", 13,
            `const bf = new PIXI.filters.BlurFilter(16);`,
            `const bf = new PIXI.filters.BlurFilter(32);`);
        if (!newClass) return;
        LightingLayer.prototype._drawLightingContainer = newClass.prototype._drawLightingContainer;
    }
});

/* ------------------------------------ */
/* When Canvas is ready					*/
/* ------------------------------------ */
Hooks.once('canvasReady', function () {
    if (isNewerVersion(game.data.version, '0.7.2')) {
        const unexploredDarkness = game.settings.get("lessfog", "unexplored_darkness");

        setUnexploredForGM(unexploredDarkness);
    }
})