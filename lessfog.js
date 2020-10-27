// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { patchMethod } from './module/patchlib.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('lessfog | Initializing lessfog');

    // Register custom module settings
    registerSettings();

    // set the dim light level
    CONFIG.Canvas.lightLevels.dim = game.settings.get("lessfog", "level_dim");

    // set the dim light level
    const exploredDarkness = game.settings.get("lessfog", "explored_darkness");
    const exploredRGB = exploredDarkness;

    CONFIG.Canvas.exploredColor = PIXI.utils.rgb2hex([exploredRGB, exploredRGB, exploredRGB]);
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
    // Allow the GM to see all tokens.
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
    const unexploredRGB = unexploredDarkness;

    if (game.user.isGM) {
        CONFIG.Canvas.unexploredColor = PIXI.utils.rgb2hex([unexploredRGB, unexploredRGB, unexploredRGB]);
        canvas.sight.refresh(); // this should be applying the new color but isn't - https://gitlab.com/foundrynet/foundryvtt/-/issues/3726
        
        // isntead we set the alpha of the `unexlored` container
        canvas.sight.fog.unexplored.alpha = 1 - unexploredDarkness;
    }
})