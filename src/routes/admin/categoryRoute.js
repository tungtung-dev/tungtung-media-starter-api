/**
 * Created by Tien Nguyen on 11/30/16.
 */
import express from "express";
import {getPaginatedCategoriesRoute, getAllCategoriesRoute, getCategoryRoute} from "../user/categoryRoute";
import {convertData} from "common-helper";
import slug from "slug";
import {saveCategory} from "../../dao/categoryDao";
import {showResultToClient} from "../../utils/responseUtils";

var route = express.Router();

// TODO Need add authorization middleware
route.get('/', getPaginatedCategoriesRoute);

// TODO Need add authorization middleware
route.post('/', (req, res) => {
    let data = convertData(req.body, {
        name: {$get: true, $default: "untitled"},
        slug: {
            $update: (value, objectData) => {
                return slug(objectData.name.toLowerCase());
            }
        },
        index: {$get: true, default: 1},
        icon: {$get: true},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true},
        parent: {$get: true}
    });
    saveCategory(data, (err, data) => {
        showResultToClient(err, data, res);
    });
});

// TODO Need add authorization middleware
route.get('/without-pagination', getAllCategoriesRoute);

// TODO Need add authorization middleware
route.get('/:category', getCategoryRoute);

// TODO Need add authorization middleware
route.put('/:category', (req, res) => {

});

// TODO Need add authorization middleware
route.delete('/:category', (req, res) => {
    
});

export default route;