export declare const USER_ROLES: {
    readonly ADMIN: 1;
    readonly MANAGER: 2;
    readonly MEMBER: 3;
};
export declare const USER_STATUSES: {
    readonly VERIFIED: 4;
    readonly ACTIVATED: 3;
    readonly DEACTIVATED: 2;
    readonly BANNED: 1;
};
export declare const GENDERS: {
    readonly MALE: 1;
    readonly FEMALE: 2;
};
export declare const RELATIONSHIP_GOALS: {
    readonly BOY_GIRL_FRIEND: 1;
    readonly MAKE_FRIENDS: 2;
    readonly SEX_PARTNER: 3;
    readonly GET_MARRIED: 4;
    readonly ONE_NIGHT_STAND: 5;
};
export declare const RELATIONSHIP_STATUSES: {
    readonly SINGLE: 1;
    readonly HAVE_BOY_GIRL_FRIEND: 2;
    readonly MARRIED: 3;
    readonly DIVORCED_WITHOUT_CHILDREN: 4;
    readonly DIVORCED_WITH_CHILDREN: 5;
    readonly SINGLE_MOM_DAD: 6;
};
export declare const EDUCATION_LEVELS: {
    readonly HIGH_SCHOOL: 1;
    readonly BACHELOR: 2;
    readonly ASSOCIATE: 3;
    readonly UNDERGRADUATE: 4;
    readonly MASTER: 5;
    readonly DOCTOR: 6;
    readonly PROFESSOR: 7;
};
export declare const MEDIA_FILE_TYPES: {
    readonly photo: 1;
    readonly video: 2;
};
export declare const WEEKLY_COINS: readonly [10, 20, 40, 70, 110, 160, 220];
export declare const WEEKLY_COINS_LENGTH: 7;
export declare const DEVICE_PLATFORMS: {
    readonly OTHER: 1;
    readonly WEB: 2;
    readonly IOS: 3;
    readonly ANDROID: 4;
};
export declare const SOCKET_TO_SERVER_EVENTS: {
    readonly SEND_MESSAGE: "sendMsg";
    readonly EDIT_MESSAGE: "editMsg";
    readonly READ_MESSAGE: "readMsg";
};
export declare const SOCKET_TO_CLIENT_EVENTS: {
    readonly UNMATCH: "unmatch";
    readonly ERROR: "error";
    readonly NEW_MESSAGE: "msg";
    readonly UPDATE_SENT_MESSAGE: "update_sent_message";
    readonly MATCH: "match";
    readonly EDIT_SENT_MESSAGE: "edit_sent_message";
};
export declare const MEMBERSHIPS: {
    FREE: number;
    TRIAL: number;
    GOLD: number;
    PLATINUM: number;
};
export declare const RESPONSE_TYPES: {
    CONVERSATIONS: string;
    CREATE_BASIC_PROFILE: string;
    CREATE_MATCH: string;
    DAILY_ATTENDANCE: string;
    DELETE_PHOTO: string;
    MATCH: string;
    MATCHES: string;
    NEARBY_PROFILES: string;
    PROFILE: string;
    PROFILES: string;
    PROFILE_FILTER: string;
    SWIPE_PROFILES: string;
    UNMATCH: string;
    UPDATE_DEVICE_TOKEN: string;
    UPDATE_PROFILE_FILTER: string;
    UPLOAD_PHOTO: string;
};
