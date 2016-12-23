/**
 * Created by Tien Nguyen on 12/23/16.
 */
import {isObjectId} from "../utils/objectIdUtils";
import {getMenuItem, getMenuItemWithoutPagination} from "../dao/menuDao";
import {showResultToClient} from "../utils/responseUtils";
import {getMenuItemWithPagination} from "../dao/menuDao";
import {deleteMenuItem} from "../dao/menuDao";


export function getMenuItemController(req, res) {
    let {menuKey} = req.params;
    let queryObj = isObjectId(menuKey) ? {_id: menuKey} : {key: menuKey};
    getMenuItem(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
}

export function getMenuItemWithoutPagController(req, res) {
    getMenuItemWithoutPagination((err, data) => {
        showResultToClient(err, data, res);
    });
}

export function getMenuController(req, res) {
    getMenuItemWithPagination(req.query, (err, data) => {
        showResultToClient(err, data, res);
    });
}

export function deleteMenuItemController(req, res) {
    let {menuKey} = req.params;
    let queryObj = isObjectId(menuKey) ? {_id: menuKey} : {key: menuKey};
    deleteMenuItem(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    })
}