/**
 * Created by Tien Nguyen on 11/24/16.
 */
import express from "express";
import {getAllContentTypeWithPagination} from "../../dao/contentTypeDao";
import {supperAdminMiddleware} from "../../middlewares/admin/permission";
import {showResultToClient} from "../../utils/responseUtils";

var route = express.Router();

route.get('/', supperAdminMiddleware, (req, res) => {
    getAllContentTypeWithPagination(req.query, (err, data) => {
        showResultToClient(err, data, res);
    });
});


export default route;