import express from "express";
import expressFormData from "express-form-data";
import mime from "mime-types";
import {createDirectory, deleteDirectory} from "../../utils/fileSystem";
import path from "path";
import fs from "fs";
import mediaUtils from "../../utils/mediaUtils";
import {folderDao, fileDao} from "../../dao/index";
import {authMiddleware} from "../../middlewares/authMiddleware";

var route = express.Router();

/**
 *
 */
route.post('/upload', authMiddleware, expressFormData.parse(), (req, res) => {
    createDirectory(mediaUtils.getFolderPathUser(req.user.username));
    createDirectory(mediaUtils.getFolderPathUser(req.user.username, 'all'));
    createDirectory(mediaUtils.getFolderThumbnailPathUser(req.user.username, 'all'));

    (async() => {
        try {
            const {folderId} = req.body;
            var folder = {};
            if (folderId !== 'all') {
                folder = await folderDao.getFolder(folderId);
                if (!folder && folderId !== 'all') {
                    res.json({success: false});
                    return;
                }
            }

            const folderSlug = folderId === 'all' ? 'all' : folder.slug;
            const folderPath = mediaUtils.getFolderPathUser(req.user.username, folderSlug);
            const folderThumbnailPath = mediaUtils.getFolderThumbnailPathUser(req.user.username, folderSlug);

            var fileUpload;
            if (req.files.uploads.length > 0) fileUpload = req.files.uploads[0];
            if (!fileUpload) {
                res.json({success: false, message: `File's empty`});
                return;
            }

            let fileUploadPath = path.join(folderPath, fileUpload.name);
            let fileThumbnailUploadPath = path.join(folderThumbnailPath, fileUpload.name);

            const fileDetail = await fileDao.saveFile({
                name: fileUpload.name,
                type: mime.lookup(fileUpload.name),
                folderSlug: folderSlug,
                folderId: folder ? folder.id : '',
                userId: req.user.id
            });

            console.log(fileDetail);

            fs.rename(fileUpload.path, fileUploadPath, () => {
                if (fileDetail.type.match('image/*')) {
                    mediaUtils.resizeImageSquare(
                        fileUploadPath,
                        fileThumbnailUploadPath,
                    ).then(() => {
                        res.json(mediaUtils.getFileDetail(fileDetail, req.user.username));
                    }).catch(e => {
                        console.log(e);
                        res.json({success: false, message: e.message});
                    })
                }
                else {
                    res.json(mediaUtils.getFileDetail(fileDetail, req.user.username));
                }
            });
        }
        catch (e) {
            console.log(e);
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
route.delete('/folders/:folderId', authMiddleware, (req, res) => {

    (async() => {
        try {
            const {folderId} = req.params;
            const folder = await folderDao.getFolder(folderId);
            if (folder) {
                const folderPath = mediaUtils.getFolderPathUser(req.user.username, folder.slug);
                console.log(folderPath);
                deleteDirectory(folderPath, () => {
                });
                folderDao.deleteFolder(folderId);
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
route.put('/folders/:folderId', authMiddleware, (req, res) => {
    (async() => {
        try {
            const {folderId} = req.params;
            const {name} = req.body;
            const folder = await folderDao.updateFolder(folderId, name, req.user.id);
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
route.get('/folders/:folderId', authMiddleware, (req, res) => {
    const {folderId} = req.params;
    (async() => {
        const photos = await fileDao.getFiles(folderId, req.user._id, req.user.username);
        res.json(photos);
    })();
});

/**
 * Delete file
 * @param file_id:ObjectID
 */
route.delete('/files/:fileId', authMiddleware, (req, res) => {
    const {fileId} = req.params;
    (async() => {
        var file = await fileDao.getFile(fileId);
        if (file) {
            const filePath = mediaUtils.getFilePathUser(req.user.username, file);
            const fileThumbnailPath = mediaUtils.getFileThumbnailPathUser(req.user.username, file);
            deleteDirectory(filePath, () => {
            });
            deleteDirectory(fileThumbnailPath, () => {
            });
            fileDao.deleteFile(fileId);
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    })();
});

export default route;