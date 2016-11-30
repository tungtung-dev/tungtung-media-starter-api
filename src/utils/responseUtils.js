/**
 * Created by Tien Nguyen on 11/30/16.
 */
/**
 * 
 * @param err
 * @param data
 * @param res
 */
export function showResultToClient(err, data, res) {
    if (err || data === null) {
        res.json({success: false, message: err === null ? "Not found" : err.message});
    } else {
        res.json(data);
    }
}
