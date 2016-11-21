import express from "express";
import expressFormData from "express-form-data";
import mime from "mime-types";
import {createDirectory, deleteDirectory} from "../../utils/fileSystem";
import path from "path";
import fs from "fs";
import mediaUtils from "../../utils/mediaUtils";
import {folderDao, fileDao} from "../../dao/index";
import authMiddleware from "../../middlewares/authMiddleware";

var route = express.Router();

/**
 *
 */
route.post('/upload', authMiddleware, expressFormData.parse(), (req, res) => {
    fileDao.reset();

    createDirectory(mediaUtils.getFolderPathUser(req.user.username));
    createDirectory(mediaUtils.getFolderPathUser(req.user.username, 'all'));
    createDirectory(mediaUtils.getFolderThumbnailPathUser(req.user.username, 'all'));

    (async() => {
        try {
            const {folder_id} = req.body;
            var folder = {};
            if (folder_id !== 'all') {
                folder = await folderDao.getFolder(folder_id);
                if (!folder && folder_id !== 'all') {
                    res.json({success: false});
                    return;
                }
            }

            const folder_slug = folder_id === 'all' ? 'all' : folder.slug;
            const folder_path = mediaUtils.getFolderPathUser(req.user.username, folder_slug);
            const folder_thumbnail_path = mediaUtils.getFolderThumbnailPathUser(req.user.username, folder_slug);

            var file_upload;
            if (req.files.uploads.length > 0) file_upload = req.files.uploads[0];
            if (!file_upload) {
                res.json({success: false, message: `File's empty`});
                return;
            }

            let file_upload_path = path.join(folder_path, file_upload.name);
            let file_thumbnail_upload_path = path.join(folder_thumbnail_path, file_upload.name);

            const file_detail = await fileDao.saveFile({
                name: file_upload.name,
                type: mime.lookup(file_upload.name),
                folder_slug,
                folder_id: folder ? folder.id : '',
                user_id: req.user.id
            });

            fs.rename(file_upload.path, file_upload_path, () => {
                if (file_detail.type.match('image/*')) {
                    mediaUtils.resizeImageSquare(
                        file_upload_path,
                        file_thumbnail_upload_path,
                    ).then(() => {
                        res.json(mediaUtils.getFileDetail(file_detail, req.user.username));
                    }).catch(e => {
                        res.json({success: false});
                    })
                }
                else {
                    res.json(mediaUtils.getFileDetail(file_detail, req.user.username));
                }
            });
        }
        catch (e) {
            res.json({success: false});
        }
    })()
});

/*
 *  Get folders
 */
route.get('/folders', authMiddleware, (req, res) => {
    (async() => {
        try {
            const folders = await folderDao.getFolders(req.user.id);
            res.json(folders);
        }
        catch (e) {
            console.log(e);
            res.json({success: false});
        }
    })();
});

/**
 * Delete folder
 */
route.delete('/folders/:folder_id', authMiddleware, (req, res) => {

    (async() => {
        try {
            const {folder_id} = req.params;
            const folder = await folderDao.getFolder(folder_id);
            if (folder) {
                const folder_path = mediaUtils.getFolderPathUser(req.user.username, folder.slug);
                console.log(folder_path);
                deleteDirectory(folder_path, () => {
                });
                folderDao.deleteFolder(folder_id);
            }
            res.json({success: true})
        }
        catch (e) {
            console.log(e);
            res.json({success: false});
        }
    })();
});

/*
 * Update folder name
 */
route.put('/folders/:folder_id', authMiddleware, (req, res) => {
    (async() => {
        try {
            const {folder_id} = req.params;
            const {name} = req.body;
            const folder = await folderDao.updateFolder(folder_id, name, req.user.id);
            if (folder) {
                res.json({success: true});
            }
            else {
                res.json({success: false});
            }
        }
        catch (e) {
            res.json({success: false, message: e});
        }
    })()
});

/*
 * Create new folder
 */
route.post('/folders', authMiddleware, (req, res) => {
    (async() => {
        try {
            const {name} = req.body;
            const folder = await folderDao.createFolder(name, req.user.id);
            if (!folder) {
                res.json({success: false, message: `Folder's exists`});
                return;
            }
            createDirectory(mediaUtils.getFolderPathUser(req.user.username, ''));
            createDirectory(mediaUtils.getFolderPathUser(req.user.username, folder.slug));
            createDirectory(mediaUtils.getFolderThumbnailPathUser(req.user.username, folder.slug));
            res.json(folder);
        }
        catch (e) {
            console.log(e);
            res.json({
                success: false,
                message: e
            })
        }
    })();
});

/*
 * Get all files
 */
route.get('/folders/all', authMiddleware, (req, res) => {
    (async() => {
        const photos = await fileDao.getFiles('', req.user._id, req.user.username);
        res.json(photos);
    })();
});

/*
 * Get files in folder
 */
route.get('/folders/:folder_id', authMiddleware, (req, res) => {
    const {folder_id} = req.params;
    (async() => {
        const photos = await fileDao.getFiles(folder_id, req.user._id, req.user.username);
        res.json(photos);
    })();
});

/**
 * Delete file
 * @param file_id:ObjectID
 */
route.delete('/files/:file_id', authMiddleware, (req, res) => {
    const {file_id} = req.params;
    (async() => {
        var file = await fileDao.getFile(file_id);
        if (file) {
            const filePath = mediaUtils.getFilePathUser(req.user.username, file);
            const fileThumbnailPath = mediaUtils.getFileThumbnailPathUser(req.user.username, file);
            deleteDirectory(filePath, () => {
            });
            deleteDirectory(fileThumbnailPath, () => {
            });
            fileDao.deleteFile(file_id);
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    })();
});

export default route;