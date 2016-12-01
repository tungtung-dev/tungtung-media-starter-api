import {getToken, checkNormalUser} from "./middlewareUtils";
import {processResult} from "./middlewareUtils";

/**
 * Verify user authentication middleware
 * @param req user request
 * @param res response
 * @param next
 * @returns {*}
 */
export function authMiddleware(req, res, next) {
    var token = getToken(req);
    checkNormalUser(token, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}