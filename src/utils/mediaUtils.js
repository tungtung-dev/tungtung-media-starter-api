import config from '../config';
import path from 'path';
import lwip from 'lwip';

const FOLDER_UPLOAD = 'user-upload';
const THUMBNAIL_NAME = 'thumbnails';
const UPLOAD_URL = `${config.domainPublic}/${FOLDER_UPLOAD}`;
const UPLOAD_PATH = `./public/${FOLDER_UPLOAD}`;

export function getFilePathUser(username, file){
    const {name, folderSlug} = file;
    return path.join(getFolderPathUser(username, folderSlug), name);
}

export function getFileThumbnailPathUser(username, file){
    const {name, folderSlug} = file;
    return path.join(getFolderPathUser(username, folderSlug + '/thumbnails/'), name);
}

export function getFolderPathUser(username, folderName = ''){
    return path.join(UPLOAD_PATH, username, folderName);
}

export function getFolderThumbnailPathUser(username, folderName = ''){
    return path.join(UPLOAD_PATH, username, folderName, THUMBNAIL_NAME);
}

export function getFileOriginalUrl(username, folderName = '', fileName = ''){
    return `${UPLOAD_URL}/${username}/${folderName}/${fileName}`;
}

export function getFileThumbnailUrl(username, folderName = '', fileName = ''){
    return `${UPLOAD_URL}/${username}/${folderName}/${THUMBNAIL_NAME}/${fileName}`;
}

export function getFileInfo(username, folderName = '', fileName = ''){
    return {
        thumbnail_url: getFileThumbnailUrl(folderName, fileName, username),
        original_url: getFileOriginalUrl(folderName, fileName, username)
    }
}

export function getFileDetail(file, username){
    const {id, _id, name, type, folderSlug, createdAt, updatedAt} = file;
    return {
        id,
        _id,
        name,
        createdAt,
        updatedAt,
        type,
        thumbnail_url: getFileThumbnailUrl(username, folderSlug, name, ),
        original_url: getFileOriginalUrl(username, folderSlug, name)
    }
}

export function resizeImageSquare(path, newPath, size = 200) {
    return new Promise((resolve, reject) => {
        lwip.open(path, function (err, image) {
            try{
                console.log(newPath);
                image.batch()
                    .cover(size, size)          // scale to 75%
                    .writeFile(newPath, function (err) {
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