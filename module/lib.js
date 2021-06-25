/**
 * Set unexplored fog alpha for GMs only (unless configured).
 * @param {number} unexploredDarkness - number between 0 and 1
 */
 export function setUnexploredForPermitted(unexploredDarkness) {
    if (game.user.isGM || game.settings.get("lessfog", "affect_all")) {
        if (isNewerVersion('0.7.6', game.data.version)) {
            canvas.sight.fog.unexplored.alpha = unexploredDarkness;
        } else if (isNewerVersion('0.8.2', game.data.version)) {
            CONFIG.Canvas.unexploredColor = PIXI.utils.rgb2hex([1 - unexploredDarkness, 1 - unexploredDarkness, 1 - unexploredDarkness]);
            canvas.sight.refresh();
        } else {
            CONFIG.Canvas.unexploredColor = PIXI.utils.rgb2hex([1 - unexploredDarkness, 1 - unexploredDarkness, 1 - unexploredDarkness]);
            canvas.perception.schedule({sight: {refresh: true}});
        }
    }
}
