import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { ProfileModel } from './profile.model';
import { MediaFile, MediaFileDocument } from './schemas/media-file.schema';
export declare class MediaFileModel extends CommonModel<MediaFile> {
    readonly model: Model<MediaFileDocument>;
    private readonly profileModel;
    constructor(model: Model<MediaFileDocument>, profileModel: ProfileModel);
}
