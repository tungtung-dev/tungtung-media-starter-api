/**
 * Created by Tien Nguyen on 11/21/16.
 */

/**
 * Get token from header
 * @param req
 * @returns {*}
 */
function getTokenFromAuthorization(req) {
    var token = req.headers['authorization'];
    if (token != null) {
        return token.substr(4, token.length);
    }
    return '';
}

export {getTokenFromAuthorization}