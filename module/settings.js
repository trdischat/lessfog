import { setUnexploredForPermitted } from './lib.js';

export const registerSettings = function () {
    /**
     * Configuration for global daylight and darkness colors.
     */
    new window.Ardittristan.ColorSetting("lessfog", "daylight_color", {
        name: "Global Daylight Color",
        hint: "Less Fog default is #EEEEEEFF. Value without this module is also #EEEEEEFF. Use this setting to adjust the color of fully bright areas when the scene Darkness Level slider is set to 0. If the Perfect Vision module is installed, you can also adjust this color separately for each scene.",
        label: "Daylight Color",
        restricted: true,
        defaultColor: "#eeeeeeff",
        scope: "world",
        onChange: (value) => {
            CONFIG.Canvas.daylightColor = parseInt(value.substring(1, 7), 16);
        }
    })
    new window.Ardittristan.ColorSetting("lessfog", "darkness_color", {
        name: "Global Darkness Color",
        hint: "Less Fog default is #484864FF. Value without this module is #242448FF. Use this setting in combination with the Darkness-Dimming setting below to set the darkness of visible but fully dark areas when the scene Darkness Level slider is set to 1. If the Perfect Vision module is installed, you can also adjust this color separately for each scene.",
        label: "Darkness Color",
        restricted: true,
        defaultColor: "#484864ff",
        scope: "world",
        onChange: (value) => {
            CONFIG.Canvas.darknessColor = parseInt(value.substring(1, 7), 16);
        }
    })
    /**
     * Configuration for dim, explored, and unexplored settings.
     */
    game.settings.register("lessfog", "dim_darkness", {
        name: "Darkness - Dimming",
        hint: "Relative darkness in dim areas (0 to 1 where 1 is fully dark). Use this setting in combination with the Darkness color above to adjust the impact of the scene Darkness Level slider. Less Fog module default is 0.8. Value without this module is 0.5.",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.8,
        config: true,
        onChange: value => {
            CONFIG.Canvas.lightLevels.dim = 1 - value;
        }
    });
    game.settings.register("lessfog", "explored_darkness", {
        name: "Darkness - Explored",
        hint: "Darkness level of Explored fog (0 to 1 where 1 is pitch black). MUST RESET FOW TO SEE CHANGE! Less Fog module default is 0.3. Value without this module is 0.5.",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.3,
        config: true,
        onChange: value => {
            CONFIG.Canvas.exploredColor = PIXI.utils.rgb2hex([1 - value, 1 - value, 1 - value]);
        }
    });
    game.settings.register("lessfog", "unexplored_darkness", {
        name: "Darkness - Unexplored",
        hint: "Darkness level of Unexplored fog. By default only for GMs (0 to 1 where 1 is pitch black). Less Fog module default is 0.8. Value without this module is 1.0.",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.8,
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
        hint: "Reveal all tokens on the canvas to the GM at all times (unless the Levels module is enabled).",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => { canvas.perception.initialize(); }
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
        onChange: s => { canvas.perception.initialize(); }
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
        onChange: value => { canvas.perception.initialize(); }
    });
}
