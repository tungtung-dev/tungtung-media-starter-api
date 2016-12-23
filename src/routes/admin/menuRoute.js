/**
 * Created by Tien Nguyen on 12/20/16.
 */
import express from "express";
import {showResultToClient} from "../../utils/responseUtils";
import {convertData} from "common-helper";
import {saveMenu, updateMenu} from "../../dao/menuDao";
import {isObjectId} from "../../utils/objectIdUtils";
import {getMenuItemWithoutPagController, getMenuItemController, getMenuController} from "../../controllers/menu";

var router = express.Router();

router.get('/', getMenuController);

router.get('/without-pagination', getMenuItemWithoutPagController);

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

router.get('/:menuKey', getMenuItemController);

export default router;