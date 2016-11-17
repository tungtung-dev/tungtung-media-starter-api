import config from '../config';
import path from 'path';
import lwip from 'lwip';

const FOLDER_UPLOAD = 'user-upload';
const THUMBNAIL_NAME = 'thumbnails';
const UPLOAD_URL = `${config.domain_public}/${FOLDER_UPLOAD}`;
const UPLOAD_PATH = `./public/${FOLDER_UPLOAD}`;

export function getFilePathUser(username, file){
    const {name, folder_slug} = file;
    return path.join(getFolderPathUser(username, folder_slug), name);
}

export function getFileThumbnailPathUser(username, file){
    const {name, folder_slug} = file;
    return path.join(getFolderPathUser(username, folder_slug + '/thumbnails/'), name);
}

export function getFolderPathUser(username, folder_name = ''){
    return path.join(UPLOAD_PATH, username, folder_name);
}

export function getFolderThumbnailPathUser(username, folder_name = ''){
    return path.join(UPLOAD_PATH, username, folder_name, THUMBNAIL_NAME);
}

export function getFileOriginalUrl(username, folder_name = '', file_name = ''){
    return `${UPLOAD_URL}/${username}/${folder_name}/${file_name}`;
}

export function getFileThumbnailUrl(username, folder_name = '', file_name = ''){
    return `${UPLOAD_URL}/${username}/${folder_name}/${THUMBNAIL_NAME}/${file_name}`;
}

export function getFileInfo(username, folder_name = '', file_name = ''){
    return {
        thumbnail_url: getFileThumbnailUrl(folder_name, file_name, username),
        original_url: getFileOriginalUrl(folder_name, file_name, username)
    }
}

export function getFileDetail(file, username){
    const {id, _id, name, type, folder_slug, created_at, updated_at} = file;
    return {
        id,
        _id,
        name,
        created_at,
        updated_at,
        type,
        thumbnail_url: getFileThumbnailUrl(username, folder_slug, name, ),
        original_url: getFileOriginalUrl(username, folder_slug, name),
    }
}

export function resizeImageSquare(path, new_path, size = 200) {
    return new Promise((resolve, reject) => {
        lwip.open(path, function (err, image) {
            try{
                console.log(new_path);
                image.batch()
                    .cover(size, size)          // scale to 75%
                    .writeFile(new_path, function (err) {
                        console.log('write file');
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(path);
                        }
                    });
            }
            catch(err){
                reject(err);
            }

        });
    })
}

export default {
    getFilePathUser,
    getFileThumbnailPathUser,
    getFolderPathUser,
    getFolderThumbnailPathUser,
    getFileOriginalUrl,
    getFileThumbnailUrl,
    getFileInfo,
    getFileDetail,
    resizeImageSquare
}