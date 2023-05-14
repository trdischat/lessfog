export const settings = {};
export const registerSettings = function () {
    /**
     * Option to set fog opacity for the GM.
     */
     game.settings.register("lessfog", "fog_opacity", {
        name: "Fog Opacity",
        hint: "Opacity of fog layer. By default only for GMs (0 to 1 where 0 is fully transparent and 1 is fully opaque). Less Fog module default is 0.75. Value without this module is 1.0.",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.75,
        config: true,
        onChange: s => {
            settings.fog_opacity = s;
            canvas.draw();
        }
    });
    /**
     * Option to reveal tokens to the GM.
     */
    game.settings.register("lessfog", "reveal_tokens", {
        name: "Reveal Tokens",
        hint: "Reveal all tokens on the canvas to the GM at all times (unless the Levels module is enabled).",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => {
            settings.reveal_tokens = s;
            canvas.perception.initialize();
        }
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
        onChange: s => {
            settings.affect_all = s;
            canvas.perception.initialize();
        }
    });
    /**
     * Hidden option used by GM vision button
     */
    game.settings.register("lessfog", "showAllToGM", {
        name: "Show All to GM",
        scope: "client",
        config: false,
        default: false,
        type: Boolean,
        onChange: value => {
            settings.showAllToGM = value;
            canvas.perception.initialize();
        }
    });
}
export const loadSettings = function () {
    settings.fog_opacity = game.settings.get("lessfog", "fog_opacity");
    settings.reveal_tokens = game.settings.get("lessfog", "reveal_tokens");
    settings.affect_all = game.settings.get("lessfog", "affect_all");
    settings.showAllToGM = game.settings.get("lessfog", "showAllToGM");
}
