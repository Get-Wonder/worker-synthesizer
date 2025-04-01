export enum SceneStatus {
  READY = 'ready',
  CHECKING_VIDEO = 'checking-video',
  VIDEO_CHECK_OK = 'video-check-ok',
  VIDEO_CHECK_ERROR = 'video-check-error',
  SPLITTING_CLIPS = 'splitting-clips',
  SPLITTER_OK = 'splitter-ok',
  SPLITTER_ERROR = 'splitter-error',
  UNZIPPING_CLIPS = 'unzipping-clips',
  UNZIP_OK = 'unzip-ok',
  UNZIP_ERROR = 'unzip-error',
  UPLOADING_RAW_CLIPS_FILE = 'uploading-raw-file',
  UPLOAD_RAW_CLIPS_FILE_ERROR = 'uploading-raw-file-error',
  CLIPS_FILE_UPLOADED = 'clips-file-uploaded'
}
