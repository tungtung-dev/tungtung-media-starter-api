/**
 * Created by Tien Nguyen on 11/30/16.
 */
import {Category} from '../models/index';
import Pagination from 'pagination-js';

/**
 * Get Categories with query and pagination
 * @param queryObj
 * @param paginationInfo
 * @param callback
 */
export function getCategoriesWithPagination(queryObj, paginationInfo, callback) {
    (async() => {
        try {
            let count = await Category.count(queryObj).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Category.find(queryObj)
                .skip(pagination.maxIndex)
                .limit(pagination.itemPerPage)
                .exec((err, data) => {
                    callback(err, err ? null : {data, pagination});
                })
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Get Categories with query
 * @param queryObj
 * @param callback
 */
export function getCategoriesWithoutPagination(queryObj, callback) {
    Category.find(queryObj)
        .exec(callback)
}

export function getCategory(queryObj, callback) {
    Category.findOne(queryObj)
        .exec(callback);
}

/**
 * Save category
 * @param category
 * @param callback
 */
export function saveCategory(category, callback) {

}