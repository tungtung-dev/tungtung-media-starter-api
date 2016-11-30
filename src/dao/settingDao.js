import {Setting} from '../models/index';

export async function getKey(key){
    var value = Setting.findOne({key});
    if(!value) return {};
    return value;
}

/**
 * 
 * @param body
 * @param callback
 */
export function editSettings(body, callback) {
    let keys = Object.keys(body);
    (async() => {
        try {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = body[key];
                let isPrivate = body[key].isPrivate;
                console.log("key = " + key + " value = " + value + " isPrivate = " + isPrivate);
                await Setting.update({key: key}, {
                    $setOnInsert: {
                        key: key,
                        createdAt: new Date()
                    },
                    $set: {
                        value: value,
                        isPrivate: isPrivate,
                        updatedAt: new Date()
                    }
                }, {upsert: true}).exec();
            }
            Setting.find().exec(callback);
        } catch (err) {
            callback(err);
        }
    })();
}

export default {getKey}