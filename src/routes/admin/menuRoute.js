/**
 * Created by Tien Nguyen on 12/20/16.
 */
import express from "express";
import {showResultToClient} from "../../utils/responseUtils";
import {convertData} from "common-helper";
import {saveMenu, getMenuItemWithPagination} from "../../dao/menuDao";
import {isObjectId} from "../../utils/objectIdUtils";
import {updateMenu} from "../../dao/menuDao";

var router = express.Router();

router.get('/', (req, res) => {
    let query = req.query;
    getMenuItemWithPagination(query, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.post('/', (req, res) => {
    let data = convertData(req.body, {
        name: {$get: true, $default: 'untitled'},
        description: {$get: true},
        key: {$get: true},
        data: {$get: true}
    });
    saveMenu(data, (err, data) => {
        showResultToClient(err, data, res);
    })
});

router.put('/:menuKey', (req, res) => {
    let {menuKey} = req.params;
    let queryObj = isObjectId(menuKey) ? {_id: menuKey} : {key: menuKey};
    let data = convertData(req.body, {
        name: {$get: true, $default: 'untitled'},
        description: {$get: true},
        key: {$get: true},
        data: {$get: true}
    });
    updateMenu(queryObj, data, (err, data) => {
        showResultToClient(err, data, res);
    })
});

export default router;