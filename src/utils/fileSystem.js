import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import mime from "mime-types";

export function getDirectories(pathBase) {
    return fs.readdirSync(pathBase).filter(function (file) {
        return fs.statSync(path.join(pathBase, file)).isDirectory();
    }).sort(function (a, b) {
        return fs.statSync(pathBase + '/' + a).ctime.getTime() -
            fs.statSync(pathBase + '/' + b).ctime.getTime();
    });
}

export function renameDirectory(oldDirectory, newDirectory, callback) {
    fs.rename(oldDirectory, newDirectory, callback);
}

export function deleteDirectory(directory, callback) {
    rimraf(directory, callback);
}

export function createDirectory(newDirectory) {
    if (!fs.existsSync(newDirectory)) {
        fs.mkdirSync(newDirectory);
        return true;
    }
    return false;
}

export function getFileInDirectory(pathBase, directory) {
    const newPath = pathBase + '/' + directory;
    return new Promise((resolve, reject) => {
        try {
            fs.readdir(newPath, (err, files) => {
                if (!files) {
                    resolve([]);
                    return;
                }
                var newFiles = files.filter(file => {
                    return fs.statSync(path.join(newPath, file)).isFile()
                }).map((file) => {
                    let fileInfo = fs.statSync(path.join(newPath, file));
                    return {
                        id: file,
                        name: file,
                        size: fileInfo.size,
                        type: mime.lookup(file),
                        created_at: fileInfo.ctime,
                        updated_at: fileInfo.mtime
                    }
                }).sort(function (file1, file2) {
                    return file1.createdAt.getTime() - file2.createdAt.getTime();
                });
                resolve(newFiles);
            })
        } catch (e) {
            reject(e);
        }
    })
}

export function walkSync(pathBase, filelist = [], folderName, level = 1) {
    var files = fs.readdirSync(pathBase);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(pathBase, file)).isDirectory() && level < 2) {
            filelist = walkSync(path.join(pathBase, file), filelist, file, level + 1);
        }
        else if(fs.statSync(path.join(pathBase, file)).isFile()){
            let fileFs = fs.statSync(path.join(pathBase, file));
            let fileInfo = {
                id: file,
                name: file,
                type: mime.lookup(file),
                folder_name: folderName,
                size: fileFs.size,
                created_at: fileFs.ctime,
                updated_at: fileFs.mtime
            };
            filelist.push(fileInfo);
        }
    });
    return filelist.sort(function (file1, file2) {
        return file1.createdAt.getTime() - file2.createdAt.getTime();
    });
}

export default {
    getDirectories,
    createDirectory,
    getFileInDirectory,
    deleteDirectory,
    renameDirectory,
    walkSync
}