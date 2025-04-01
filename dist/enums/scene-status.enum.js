"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneStatus = void 0;
var SceneStatus;
(function (SceneStatus) {
    SceneStatus["READY"] = "ready";
    SceneStatus["CHECKING_VIDEO"] = "checking-video";
    SceneStatus["VIDEO_CHECK_OK"] = "video-check-ok";
    SceneStatus["VIDEO_CHECK_ERROR"] = "video-check-error";
    SceneStatus["SPLITTING_CLIPS"] = "splitting-clips";
    SceneStatus["SPLITTER_OK"] = "splitter-ok";
    SceneStatus["SPLITTER_ERROR"] = "splitter-error";
    SceneStatus["UNZIPPING_CLIPS"] = "unzipping-clips";
    SceneStatus["UNZIP_OK"] = "unzip-ok";
    SceneStatus["UNZIP_ERROR"] = "unzip-error";
    SceneStatus["UPLOADING_RAW_CLIPS_FILE"] = "uploading-raw-file";
    SceneStatus["UPLOAD_RAW_CLIPS_FILE_ERROR"] = "uploading-raw-file-error";
    SceneStatus["CLIPS_FILE_UPLOADED"] = "clips-file-uploaded";
})(SceneStatus = exports.SceneStatus || (exports.SceneStatus = {}));
//# sourceMappingURL=scene-status.enum.js.map