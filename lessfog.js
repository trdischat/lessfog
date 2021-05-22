// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { patchMethod } from './module/patchlib.js';
import { replaceGetter } from './module/patchlib.js';
import { callOriginalGetter } from './module/patchlib.js';

CONFIG.LESSFOG = {NOFURNACE: true};

/**
 * Set unexplored fog alpha for GMs only (unless configured).
 * @param {number} unexploredDarkness - number between 0 and 1
 */
export function setUnexploredForPermitted(unexploredDarkness) {
    if (game.user.isGM || game.settings.get("lessfog", "affect_all")) {
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
    /**
     * Patch `restrictVisibility` to allow the GM to see all tokens.
     */
    let newClass = SightLayer;

    // Set it to affect all players if the setting is enabled
    let affected = (game.settings.get("lessfog", "affect_all")) ? "game.users.entities" : "game.user.isGM";

    newClass = patchMethod(newClass, "restrictVisibility", 4,
        `t.visible = ( !this.tokenVision && !t.data.hidden ) || t.isVisible;`,
        `t.visible = ( !this.tokenVision && !t.data.hidden ) || ( game.settings.get("lessfog", "reveal_tokens") && ${affected}) || t.isVisible;`);
    if (!newClass) return;
    SightLayer.prototype.restrictVisibility = newClass.prototype.restrictVisibility;

});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
    // Determine whether legacy Furnace module is active
    if (game.modules.get("furnace")?.active) {
        if (isNewerVersion('2.6.1', game.modules.get("furnace").data.version.match(/[\d.]/g).join(''))) {
            CONFIG.LESSFOG.NOFURNACE = false;
        } 
    }

    // Disable sight layer's token vision if GM and option enabled
    if (CONFIG.LESSFOG.NOFURNACE) {
        replaceGetter(SightLayer, 'tokenVision', function () {
            if (game.user.isGM && game.settings.get("lessfog", "showAllToGM")) return false;
            return callOriginalGetter(this, "tokenVision");
        });
    }
});

/* ------------------------------------ */
/* When Canvas is ready					*/
/* ------------------------------------ */
Hooks.once('canvasReady', function () {
    const unexploredDarkness = game.settings.get("lessfog", "unexplored_darkness");
    setUnexploredForPermitted(unexploredDarkness);
})

/* ------------------------------------ */
/* Additional Hooks                     */
/* ------------------------------------ */

Hooks.on('getSceneControlButtons', controls => {
    if (CONFIG.LESSFOG.NOFURNACE) {
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