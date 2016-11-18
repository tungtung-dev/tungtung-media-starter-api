/**
 * Created by Tien Nguyen on 11/18/16.
 */

const RANDOM_CHARACTER_LENGTH = 5;
/**
 * Support generate random string with 5 characters
 * @returns {string}
 */
function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < RANDOM_CHARACTER_LENGTH; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export {makeId}

export default {makeId}