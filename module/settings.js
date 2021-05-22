import { setUnexploredForPermitted } from '../lessfog.js';

export const registerSettings = function () {
    /**
     * Configuration for dim, explored, and unexplored settings.
     */
    game.settings.register("lessfog", "dim_darkness", {
        name: "Darkness - Dimming",
        hint: "Relative darkness in dim areas (0 to 1 where 1 is fully dark).",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.5,
        config: true,
        onChange: value => {
            CONFIG.Canvas.lightLevels.dim = 1 - value;
        }
    });
    game.settings.register("lessfog", "explored_darkness", {
        name: "Darkness - Explored",
        hint: "Darkness level of Explored fog for all (0 to 1 where 1 is pitch black). MUST RESET FOW TO SEE CHANGE!",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.7,
        config: true,
        onChange: value => {
            CONFIG.Canvas.exploredColor = PIXI.utils.rgb2hex([1 - value, 1 - value, 1 - value]);
        }
    });
    game.settings.register("lessfog", "unexplored_darkness", {
        name: "Darkness - Unexplored",
        hint: "Darkness level of the Unexplored fog. By default only for GMs (0 to 1 where 1 is pitch black).",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.85,
        config: true,
        onChange: value => {
            setUnexploredForPermitted(value);
        }
    });
    /**
     * Option to reveal tokens to the GM.
     */
    game.settings.register("lessfog", "reveal_tokens", {
        name: "Reveal Tokens",
        hint: "Reveal all tokens on the canvas to the GM at all times.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => { canvas.draw(); }
    });
    /**
     * Option to affect all players
     */
    game.settings.register("lessfog", "affect_all", {
        name: "Reveal to All Players",
        hint: "Reveal Unexplored areas and tokens to all players (useful if you just want to know about line of sight).",
        scope: "world",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => { canvas.draw(); }
    });
    /**
     * Hidden option used by GM vision button
     */
    game.settings.register("lessfog", "showAllToGM", {
        name: "Show All to GM",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: value => {
            canvas.initializeSources();
        }
    });
}
