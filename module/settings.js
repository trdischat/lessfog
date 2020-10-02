export const registerSettings = function () {
    /**
     * Configuration for dim, dark, explored, and unexplored settings.
     */
    game.settings.register("lessfog", "alpha_unexplored", {
        name: "Unexplored",
        hint: "Darkness in unexplored areas (GM only)",
        scope: "world",
        type: Number,
        range: {
            min: 0.6,
            max: 1.0,
            step: 0.05
        },
        default: 0.9,
        config: true,
        onChange: s => { canvas.draw(); }
    });
    game.settings.register("lessfog", "alpha_explored", {
        name: "Explored",
        hint: "Darkness in explored areas",
        scope: "world",
        type: Number,
        range: {
            min: 0.4,
            max: 0.8,
            step: 0.05
        },
        default: 0.7,
        config: true,
        onChange: s => { canvas.draw(); }
    });
    if (isNewerVersion('0.7.3', game.data.version)) {
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
