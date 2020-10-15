export const registerSettings = function () {
    /**
     * Configuration for dim, dark, explored, and unexplored settings.
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
            onChange: s => { canvas.draw(); }
        });
        game.settings.register("lessfog", "color_dark", {
            name: "Color - Darkness",
            hint: "Input color of dark areas in hex format: 0xRRGGBB",
            scope: "world",
            type: String,
            default: "0x242448",
            config: true,
            onChange: s => { canvas.draw(); }
        });
        game.settings.register("lessfog", "color_explored", {
            name: "Color - Explored",
            hint: "Input color of explored areas in hex format: 0xRRGGBB",
            scope: "world",
            type: String,
            default: "0x7f7f7f",
            config: true,
            onChange: s => { canvas.draw(); }
        });
        game.settings.register("lessfog", "color_unexplored", {
            name: "Color - Unexplored (GM only)",
            hint: "Input color of unexplored areas in hex format: 0xRRGGBB",
            scope: "world",
            type: String,
            default: "0x202020",
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
