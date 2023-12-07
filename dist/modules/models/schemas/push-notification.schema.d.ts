/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { HydratedDocument, Types } from 'mongoose';
import { CommonSchema } from '../../../commons/schemas.common';
export type PushNotificationDocument = HydratedDocument<PushNotification>;
export declare class PushNotification extends CommonSchema {
    _userId: Types.ObjectId;
    _targetUserId?: Types.ObjectId;
    _signedDeviceId: Types.ObjectId;
    title?: string;
    content?: string;
}
export declare const PushNotificationSchema: import("mongoose").Schema<PushNotification, import("mongoose").Model<PushNotification, any, any, any, import("mongoose").Document<unknown, any, PushNotification> & PushNotification & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PushNotification, import("mongoose").Document<unknown, {}, PushNotification> & PushNotification & Required<{
    _id: Types.ObjectId;
}>>;
