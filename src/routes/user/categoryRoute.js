/**
 * Created by Tien Nguyen on 11/30/16.
 */
import express from "express";
import {getCategoriesWithPagination, getCategoriesWithoutPagination} from "../../dao/categoryDao";
import {isObjectId} from "../../utils/objectIdUtils";
import {getCategory} from "../../dao/categoryDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getOrderByObject} from "../../utils/orderByManager";

var route = express.Router();

route.get('/', getPaginatedCategoriesRoute);

route.get('/without-pagination', getAllCategoriesRoute);

route.get('/sub-categories/:category', getSubCategoryRoute);

route.get('/:category', getCategoryRoute);

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getAllCategoriesRoute(req, res) {
    let orderBy = getOrderByObject(req.query);
    getCategoriesWithoutPagination({}, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
}

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getPaginatedCategoriesRoute(req, res) {
    let orderBy = getOrderByObject(req.query);
    getCategoriesWithPagination({}, req.query, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
}

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getCategoryRoute(req, res) {
    let {category} = req.params;
    let isId = isObjectId(category);
    let queryObj = isId ? {_id: category} : {slug: category};
    getCategory(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    })
}

/**
 *
 * @param req
 * @param res
 */
export function getSubCategoryRoute(req, res) {
    let {category} = req.params;
    let isId = isObjectId(category);
    let queryObj = isId ? {_id: category} : {slug: category};
    let orderBy = getOrderByObject(req.query);
    getCategory(queryObj, (err, category) => {
        if (err || category === null) {
            showResultToClient(err, category, res);
        } else {
            getCategoriesWithPagination({parentId: category._id}, req.query, orderBy, (err, data) => {
                showResultToClient(err, data, res);
            });
        }
    })
}

export default route;