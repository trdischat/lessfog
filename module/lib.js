export const MODULE_ID = 'lessfog';

/**
 * Helper function to test game generation
 * @param {Number} val   Minimum generation (major version number)
 * @returns {Boolean}    True if game generation equals or exceed minimum
 */
 export function minGen(val) {
    return val <= ( game.release?.generation || parseInt((game.version || game.data.version).split(".")[1]) );
} 

/**
 * Helper function to test game version
 * @param {String} val   Minimum version (full version string)
 * @returns {Boolean}    True if game version equals or exceeds minimum
 */
export function minVer(val) {
    return !(foundry.utils.isNewerVersion(val, game.version || game.data.version));
} 

/** Class to send debug messages to console if enabled */
export class debug {
  /**
   * Getter tests if debug is enabled.
   * @return {boolean}        True if debug is enabled.
   */
  static get enabled() {
      return false;
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
