/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Tag} from '../models/index';
import slug from 'slug';
import Pagination from 'pagination-js';

/**
 * Save new tag if it is not exist
 * @param tag
 * @returns {*}
 */
async function saveTagIfNeeded(tag) {
    let slugged_tag = slug(tag);
    try {
        await Tag.update({slug: slugged_tag}, {
            $set: {
                updated_at: new Date()
            },
            $setOnInsert: {
                tag_name: tag,
                slug: slugged_tag,
                created_at: new Date()
            }
        }, {upsert: true}).exec();
        let result = await Tag.findOne({slug: slugged_tag}).exec();
        return result._id;
    } catch (err) {
        return null;
    }
}

/**
 * Save Array of Tag
 * @param tags
 * @returns {Array}
 */
async function saveTags(tags) {
    let tag_ids = [];
    for (let i = 0; i < tags.length; i++) {
        let tag_id = await saveTagIfNeeded(tags[i]);
        if (tag_id !== null) {
            tag_ids.push(tag_id);
        }
    }
    return tag_ids;
}

/**
 * Get tags with pagination by query
 * @param queryObj query object: ex: {}, {_id: "123"}
 * @param pagination_info include item_per_page and page information to get pagination data
 * @param callback
 */
function getTagsWithPagination(queryObj, pagination_info, callback) {
    (async() => {
        try {
            let count = await Tag.count(queryObj).exec();
            let pagination = (new Pagination(pagination_info, count)).getPagination();
            Tag.find(queryObj)
                .skip(pagination.min_index)
                .limit(pagination.item_per_page)
                .exec((err, data) => {
                    callback(err, {data, pagination});
                });
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Get all tags with pagination
 * @param pagination_info include item_per_page and page information to get pagination data
 * @param callback
 */
function getAllTagsWithPagination(pagination_info, callback) {
    let queryObj = {};
    getTagsWithPagination(queryObj, pagination_info, callback);
}

export {saveTagIfNeeded, saveTags, getAllTagsWithPagination}
export default {saveTagIfNeeded, saveTags, getAllTagsWithPagination}