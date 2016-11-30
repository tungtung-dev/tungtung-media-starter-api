/**
 * Created by Tien Nguyen on 11/30/16.
 */
import express from "express";
import {getPaginatedCategoriesRoute, getAllCategoriesRoute, getCategoryRoute} from "../user/categoryRoute";

var route = express.Router();

// TODO Need add authorization middleware
route.get('/', getPaginatedCategoriesRoute);

// TODO Need add authorization middleware
route.get('/without-pagination', getAllCategoriesRoute);

// TODO Need add authorization middleware
route.get('/:category', getCategoryRoute);

export default route;