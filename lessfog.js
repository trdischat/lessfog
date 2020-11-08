// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { patchMethod } from './module/patchlib.js';

/**
 * Set unexplored fog alpha for GMs only.
 * @param {number} unexploredDarkness - number between 0 and 1
 */
export function setUnexploredForGM(unexploredDarkness) {
    if (game.user.isGM) {
        if (isNewerVersion('0.7.6', game.data.version)) {
            canvas.sight.fog.unexplored.alpha = unexploredDarkness;
        } else {
            CONFIG.Canvas.unexploredColor = PIXI.utils.rgb2hex([1-unexploredDarkness, 1-unexploredDarkness, 1-unexploredDarkness]);
            canvas.sight.refresh();
        }
    }
}

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('lessfog | Initializing lessfog');

    // Register custom module settings
    registerSettings();

    // set the dim light level
    CONFIG.Canvas.lightLevels.dim = 1 - game.settings.get("lessfog", "dim_darkness");

    // set the explored color based on selected darkness level
    const exploredDarkness = 1 - game.settings.get("lessfog", "explored_darkness");
    CONFIG.Canvas.exploredColor = PIXI.utils.rgb2hex([exploredDarkness, exploredDarkness, exploredDarkness]);
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

});

/* ------------------------------------ */
/* When Canvas is ready					*/
/* ------------------------------------ */
Hooks.once('canvasReady', function () {
    const unexploredDarkness = game.settings.get("lessfog", "unexplored_darkness");
    setUnexploredForGM(unexploredDarkness);
})
