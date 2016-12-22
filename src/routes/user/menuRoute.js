/**
 * Created by Tien Nguyen on 11/30/16.
 */
import express from "express";
import {getMenuItemWithPagination, getMenuItemWithoutPagination, getMenuItem} from "../../dao/menuDao";
import {showResultToClient} from "../../utils/responseUtils";
import {isObjectId} from "../../utils/objectIdUtils";

var router = express.Router();

router.get('/', (req, res) => {
    getMenuItemWithPagination(req.query, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.get('/without-pagination', (req, res) => {
    getMenuItemWithoutPagination((err, data) => {
        showResultToClient(err, data, res);
    });
});

router.get('/:menuKey', (req, res) => {
    let {menuKey} = req.params;
    let queryObj = isObjectId(menuKey) ? {_id: menuKey} : {key: menuKey};
    getMenuItem(queryObj, (err, data) => {
       showResultToClient(err, data, res);
    });
});


export default router;