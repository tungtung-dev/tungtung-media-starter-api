/**
 * Created by Tien Nguyen on 11/30/16.
 */
import express from "express";
import {getCategoriesWithPagination, getCategoriesWithoutPagination} from "../../dao/categoryDao";
import {isObjectId} from "../../utils/objectIdUtils";
import {getCategory} from "../../dao/categoryDao";
import {showResultToClient} from "../../utils/responseUtils";

var route = express.Router();

route.get('/', getPaginatedCategoriesRoute);

route.get('/without-pagination', getAllCategoriesRoute);

route.get('/:category', getCategoryRoute);

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getAllCategoriesRoute(req, res) {
    getCategoriesWithoutPagination({}, (err, data) => {
        showResultToClient(err, data, res);
    });
}

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getPaginatedCategoriesRoute(req, res) {
    getCategoriesWithPagination({}, req.query, (err, data) => {
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
    console.log("isId = " + isId + " category: " + category);
    getCategory(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    })
}

export default route;