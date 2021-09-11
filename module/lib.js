export const MODULE_ID = 'lessfog';

/** Class to send debug messages to console if enabled in DevMode module. */
export class debug {
  /**
   * Getter tests if debug is enabled.
   * @return {boolean}        True if debug is enabled.
   */
  static get enabled() {
      return game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID);
  }
  /**
   * Helper function to output debug messages to console if debug is enabled.
   * @param {boolean} force    True = output always, False = output only if debugging enabled.
   * @param  {...any} args     Arguments to pass through to console.log().
   */
  static log(force, ...args) {
      try {
          if (force || this.enabled) {
              console.log(MODULE_ID, '|', ...args);
          }
      } catch (e) {
          console.log(`ERROR: ${MODULE_ID} debug logging function failed`, e);
      }
  }
}

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
