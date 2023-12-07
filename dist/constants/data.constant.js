"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_TYPES = exports.MEMBERSHIPS = exports.SOCKET_TO_CLIENT_EVENTS = exports.SOCKET_TO_SERVER_EVENTS = exports.DEVICE_PLATFORMS = exports.WEEKLY_COINS_LENGTH = exports.WEEKLY_COINS = exports.MEDIA_FILE_TYPES = exports.EDUCATION_LEVELS = exports.RELATIONSHIP_STATUSES = exports.RELATIONSHIP_GOALS = exports.GENDERS = exports.USER_STATUSES = exports.USER_ROLES = void 0;
exports.USER_ROLES = {
    ADMIN: 1,
    MANAGER: 2,
    MEMBER: 3,
};
exports.USER_STATUSES = {
    VERIFIED: 4,
    ACTIVATED: 3,
    DEACTIVATED: 2,
    BANNED: 1,
};
exports.GENDERS = {
    MALE: 1,
    FEMALE: 2,
};
exports.RELATIONSHIP_GOALS = {
    BOY_GIRL_FRIEND: 1,
    MAKE_FRIENDS: 2,
    SEX_PARTNER: 3,
    GET_MARRIED: 4,
    ONE_NIGHT_STAND: 5,
};
exports.RELATIONSHIP_STATUSES = {
    SINGLE: 1,
    HAVE_BOY_GIRL_FRIEND: 2,
    MARRIED: 3,
    DIVORCED_WITHOUT_CHILDREN: 4,
    DIVORCED_WITH_CHILDREN: 5,
    SINGLE_MOM_DAD: 6,
};
exports.EDUCATION_LEVELS = {
    HIGH_SCHOOL: 1,
    BACHELOR: 2,
    ASSOCIATE: 3,
    UNDERGRADUATE: 4,
    MASTER: 5,
    DOCTOR: 6,
    PROFESSOR: 7,
};
exports.MEDIA_FILE_TYPES = {
    photo: 1,
    video: 2,
};
exports.WEEKLY_COINS = [10, 20, 40, 70, 110, 160, 220];
exports.WEEKLY_COINS_LENGTH = exports.WEEKLY_COINS.length;
exports.DEVICE_PLATFORMS = {
    OTHER: 1,
    WEB: 2,
    IOS: 3,
    ANDROID: 4,
};
exports.SOCKET_TO_SERVER_EVENTS = {
    SEND_MESSAGE: 'sendMsg',
    EDIT_MESSAGE: 'editMsg',
    READ_MESSAGE: 'readMsg',
};
exports.SOCKET_TO_CLIENT_EVENTS = {
    UNMATCH: 'unmatch',
    ERROR: 'error',
    NEW_MESSAGE: 'msg',
    UPDATE_SENT_MESSAGE: 'update_sent_message',
    MATCH: 'match',
    EDIT_SENT_MESSAGE: 'edit_sent_message',
};
exports.MEMBERSHIPS = {
    FREE: 1,
    TRIAL: 2,
    GOLD: 3,
    PLATINUM: 4,
};
exports.RESPONSE_TYPES = {
    CONVERSATIONS: 'conversations',
    CREATE_BASIC_PROFILE: 'create_basic_profile',
    CREATE_MATCH: 'create_match',
    DAILY_ATTENDANCE: 'daily_attendance',
    DELETE_PHOTO: 'delete_photo',
    MATCH: 'match',
    MATCHES: 'matches',
    NEARBY_PROFILES: 'nearby_profiles',
    PROFILE: 'profile',
    PROFILES: 'profiles',
    PROFILE_FILTER: 'profile_filter',
    SWIPE_PROFILES: 'swipe_profiles',
    UNMATCH: 'unmatch',
    UPDATE_DEVICE_TOKEN: 'update_device_token',
    UPDATE_PROFILE_FILTER: 'update_profile_filter',
    UPLOAD_PHOTO: 'update_photo',
};
//# sourceMappingURL=data.constant.js.map