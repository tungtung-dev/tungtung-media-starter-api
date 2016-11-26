/**
 * Created by Tien Nguyen on 11/24/16.
 */
import express from "express";
import url from 'url';
import {getAllContentTypeWithPagination} from "../../dao/contentTypeDao";
import {supperAdminMiddleware} from "../../middlewares/admin/permission";

var route = express.Router();

route.get('/', supperAdminMiddleware, (req, res) => {
    let urlParts = url.parse(req.url, true);
    let query = urlParts.query;
    getAllContentTypeWithPagination(query, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});


export default route;