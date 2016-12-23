/**
 * Created by Tien Nguyen on 12/20/16.
 */
import {Menu} from '../models/index';
import Pagination from 'pagination-js';

/**
 *
 * @param paginationInfo
 * @param callback
 */
export async function getMenuItemWithPagination(paginationInfo, callback) {
    let queryObj = {};
    try {
        let count = await Menu.count(queryObj).exec();
        let pagination = (new Pagination(paginationInfo, count)).getPagination();
        let menus = await Menu.find(queryObj)
            .skip(pagination.minIndex)
            .limit(pagination.itemPerPage)
            .exec();
        callback(null, {data: menus, pagination: pagination})
    } catch (err) {
        callback(err);
    }
}

/**
 *
 * @param callback
 */
export function getMenuItemWithoutPagination(callback) {
    Menu.find().exec(callback);
}

/**
 *
 * @param queryObj
 * @param callback
 */
export function getMenuItem(queryObj, callback) {
    Menu.findOne(queryObj).exec(callback);
}

/**
 *
 * @param data
 * @param callback
 */
export function saveMenu(data, callback) {
    let menu = new Menu(data);
    menu.save(callback);
}

/**
 * 
 * @param queryObj
 * @param data
 * @param callback
 */
export function updateMenu(queryObj, data, callback) {
    Menu.findOneAndUpdate(queryObj, {$set: data}, {new: true}).exec(callback);
}

export function deleteMenuItem(queryObj, callback) {
    Menu.findOneAndRemove(queryObj).exec(callback);
}
