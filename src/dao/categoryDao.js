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
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
                .exec((err, data) => {
                    callback(err, err ? null : {data, pagination});
                });
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
 * @param category category Object
 * @param callback
 */
export function saveCategory(category, callback) {
    (async() => {
        let count = await Category.count({slug: category.slug}).exec();
        if (count > 0) {
            callback(new Error("Tag name " + category.name + " already exists!"));
        } else {
            let obj = new Category(category);
            obj.save(callback);
        }
    })();
}

/**
 *
 * @param queryObj
 * @param category
 * @param callback
 */
export function updateCategory(queryObj, category, callback) {
    Category.findOneAndUpdate(queryObj, {$set: category}, {new: true, multi: true}).exec(callback);
}

/**
 * 
 * @param queryObj
 * @param callback
 */
export function deleteCategory(queryObj, callback) {
    Category.findOneAndRemove(queryObj).exec(callback);
}