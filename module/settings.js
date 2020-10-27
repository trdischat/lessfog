export const registerSettings = function () {
    /**
     * Configuration for dim, explored, and unexplored settings.
     */
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
            if (game.user.isGM) {
                CONFIG.Canvas.unexploredColor = PIXI.utils.rgb2hex([value, value, value]);
                canvas.sight.refresh(); // this should be applying the new color but isn't - https://gitlab.com/foundrynet/foundryvtt/-/issues/3726

                // isntead we set the alpha of the `unexlored` container
                canvas.sight.fog.unexplored.alpha = 1 - value;
            }
        }
    });

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
