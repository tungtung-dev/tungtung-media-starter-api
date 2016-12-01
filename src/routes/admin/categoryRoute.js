/**
 * Created by Tien Nguyen on 11/30/16.
 */
import express from "express";
import {getPaginatedCategoriesRoute, getAllCategoriesRoute, getCategoryRoute} from "../user/categoryRoute";
import {convertData} from "common-helper";
import slug from "slug";
import {saveCategory, updateCategory, deleteCategory} from "../../dao/categoryDao";
import {showResultToClient} from "../../utils/responseUtils";
import {isObjectId} from "../../utils/objectIdUtils";
import {
    viewCategoryMiddleware,
    deleteCategoryMiddleware,
    editCategoryMiddleware,
    createCategoryMiddleware
} from "../../middlewares/admin/category";
import {getSubCategoryRoute} from "../user/categoryRoute";

var route = express.Router();

route.get('/', viewCategoryMiddleware, getPaginatedCategoriesRoute);

route.post('/', createCategoryMiddleware, (req, res) => {
    let data = convertData(req.body, {
        name: {$get: true, $default: "untitled"},
        slug: {
            $update: (value, objectData) => {
                return slug(objectData.name.toLowerCase());
            }
        },
        index: {$get: true, $default: 1},
        icon: {$get: true},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true},
        parentId: {$get: true}
    });
    saveCategory(data, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.get('/without-pagination', viewCategoryMiddleware, getAllCategoriesRoute);

route.get('/sub-categories/:category', viewCategoryMiddleware, getSubCategoryRoute);

route.get('/:category', viewCategoryMiddleware, getCategoryRoute);

route.put('/:category', editCategoryMiddleware, (req, res) => {
    let {category} = req.params;
    let isId = isObjectId(category);
    let queryObj = isId ? {_id: category} : {slug: category};
    let data = convertData(req.body, {
        name: {$get: true},
        slug: {
            $update: (value, objectData) => {
                return objectData.name ? slug(objectData.name.toLowerCase()) : value;
            }
        },
        index: {$get: true},
        icon: {$get: true},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true},
        parentId: {$get: true},
        updatedAt: {$get: true, default: new Date()}
    });
    updateCategory(queryObj, data, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.delete('/:category', deleteCategoryMiddleware, (req, res) => {
    let {category} = req.params;
    let isId = isObjectId(category);
    let queryObj = isId ? {_id: category} : {slug: category};
    deleteCategory(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});

export default route;