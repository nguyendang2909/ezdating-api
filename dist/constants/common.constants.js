"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEXS = exports.FILE_UPLOAD_FOLDERS_ARR = exports.FILE_UPLOAD_FOLDERS = exports.BULL_QUEUE_JOBS = exports.BULL_QUEUE_EVENTS = exports.MODULE_INSTANCES = exports.DATE_FORMATS = void 0;
exports.DATE_FORMATS = {
    RAW_BIRTHDAY: 'YYYY-MM-DD',
};
exports.MODULE_INSTANCES = {
    REDIS: 'REDIS',
    REDIS_LOCK: 'REDIS_LOCK',
    FIREBASE: 'FIREBASE',
    GOOGLE_OAUTH_CLIENT: 'GOOGLE_OAUTH_CLIENT',
};
exports.BULL_QUEUE_EVENTS = {
    SENT_LIKE: 'sent_like',
    SENT_MESSAGE: 'sent_message',
    MATCHES: 'matches',
};
exports.BULL_QUEUE_JOBS = {
    MATCHES: {
        UNMATCHED: 'unmatched',
    },
};
exports.FILE_UPLOAD_FOLDERS = {
    PHOTOS: 'photos',
};
exports.FILE_UPLOAD_FOLDERS_ARR = Object.values(exports.FILE_UPLOAD_FOLDERS);
exports.REGEXS = {
    BIRTHDAY: /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i,
};
//# sourceMappingURL=common.constants.js.map