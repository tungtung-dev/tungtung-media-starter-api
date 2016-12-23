/**
 * Created by Tien Nguyen on 11/30/16.
 */
import express from "express";
import {getMenuItemWithoutPagController, getMenuItemController} from "../../controllers/menu";
import {getMenuController} from "../../controllers/menu";

var router = express.Router();

router.get('/', getMenuController);

router.get('/without-pagination', getMenuItemWithoutPagController);

router.get('/:menuKey', getMenuItemController);

export default router;