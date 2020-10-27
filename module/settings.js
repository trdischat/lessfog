import { setUnexploredForGM } from '../lessfog.js';

export const registerSettings = function () {
    /**
     * Configuration for dim, explored, and unexplored settings.
     */
    if (isNewerVersion('0.7.3', game.data.version)) {
        game.settings.register("lessfog", "alpha_unexplored", {
            name: "Unexplored",
            hint: "Darkness in unexplored areas (GM only)",
            scope: "world",
            type: Number,
            default: 0.85,
            config: true,
            onChange: s => { canvas.draw(); }
        });
        game.settings.register("lessfog", "alpha_explored", {
            name: "Explored",
            hint: "Darkness in explored areas",
            scope: "world",
            type: Number,
            default: 0.75,
            config: true,
            onChange: s => { canvas.draw(); }
        });
        game.settings.register("lessfog", "alpha_dark", {
            name: "Dark",
            hint: "Darkness in dark areas (not used)",
            scope: "world",
            type: Number,
            default: 0.6,
            config: true,
            onChange: s => { canvas.draw(); }
        });
        game.settings.register("lessfog", "alpha_dim", {
            name: "Dim",
            hint: "Darkness in dim areas",
            scope: "world",
            type: Number,
            default: 0.4,
            config: true,
            onChange: s => { canvas.draw(); }
        });
    } else {
        game.settings.register("lessfog", "level_dim", {
            name: "Dimming",
            hint: "Relative brightness in dim areas",
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
                CONFIG.Canvas.lightLevels.dim = value;
            }
        });
        game.settings.register("lessfog", "explored_darkness", {
            name: "Darkness - Explored",
            hint: "Darkness level of Explored fog for all. 0 to 1 where 0 is Pitch Black",
            scope: "world",
            type: Number,
            range: {
                min: 0,
                max: 1,
                step: 0.05
            },
            default: 0.25,
            config: true,
            onChange: value => {
                CONFIG.Canvas.exploredColor = PIXI.utils.rgb2hex([value, value, value]);
            }
        });
        game.settings.register("lessfog", "unexplored_darkness", {
            name: "Darkness - Unexplored (GM only)",
            hint: "Darkness level of the Unexplored fog for GMs. 0 to 1 where 0 is Pitch Black",
            scope: "world",
            type: Number,
            range: {
                min: 0,
                max: 1,
                step: 0.05
            },
            default: 0.15,
            config: true,
            onChange: value => {
                setUnexploredForGM(value);
            }
        });
    }
    /**
     * Option to reveal tokens to the GM.
     */
    game.settings.register("lessfog", "reveal_tokens", {
        name: "Reveal Tokens",
        hint: "Reveal all tokens on the canvas to the GM at all times",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => { canvas.draw(); }
    });
}
