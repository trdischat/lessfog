export const registerSettings = function () {
    /**
     * Configuration for dim, dark, explored, and unexplored settings.
     */
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
}
