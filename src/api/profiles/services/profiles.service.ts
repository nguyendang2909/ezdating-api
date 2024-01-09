// import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// import mongoose from 'mongoose';

// import { ERROR_MESSAGES } from '../../../commons/messages';
// import { FilesService } from '../../../libs';
// import { ClientData } from '../../auth/auth.type';
// import { UploadPhotoDtoDto } from '../../media-files/dto/upload-photo.dto';
// import {
//   BasicProfile,
//   BasicProfileModel,
//   ProfileModel,
//   UserModel,
// } from '../../models';
// import { MongoConnection } from '../../models/mongo.connection';
// import { MediaFile } from '../../models/schemas/media-file.schema';
// import { ProfilesCommonService } from '../base/profiles.common.service';

// @Injectable()
// export class ProfilesService extends ProfilesCommonService {
//   constructor(
//     private readonly profileModel: ProfileModel,
//     private readonly basicProfileModel: BasicProfileModel,
//     private readonly filesService: FilesService,
//     private readonly userModel: UserModel,
//     private readonly mongoConnection: MongoConnection,
//   ) {
//     super();
//   }

//   logger = new Logger(ProfilesService.name);

//   async createProfile(basicProfile: BasicProfile, mediaFile: MediaFile) {
//     await this.mongoConnection.withTransaction(async () => {
//       await this.profileModel.createOne({
//         ...basicProfile,
//         mediaFiles: [
//           {
//             _id: mediaFile._id,
//             key: mediaFile.key,
//             type: mediaFile.type,
//           },
//         ],
//       });
//       await this.userModel.updateOneById(basicProfile._id, {
//         $set: { haveProfile: true },
//       });
//     });
//     await this.basicProfileModel.deleteOne(basicProfile._id).catch((error) => {
//       this.logger.error(
//         `Failed to remove basic profile ${basicProfile._id.toString()} with error ${JSON.stringify(
//           error,
//         )}`,
//       );
//     });
//   }

//   public async uploadBasicPhoto(
//     file: Express.Multer.File,
//     payload: UploadPhotoDtoDto,
//     client: ClientData,
//   ) {
//     const { _currentUserId } = this.getClient(client);
//     let { profile, basicProfile } = await this.tryFindProfileAndBasicProfile(
//       _currentUserId,
//     );
//     if (profile) {
//       this.profileModel.verifyCanUploadFiles(profile);
//     }
//     return await this.mongoConnection.withTransaction(async () => {
//       const mediaFile = await this.filesService.createPhoto(
//         file,
//         _currentUserId,
//       );
//       if (profile) {
//         await this.filesService.updateProfileAfterCreatePhoto(
//           mediaFile,
//           _currentUserId,
//         );
//         return mediaFile;
//       }
//       if (basicProfile) {
//         try {
//           await this.createProfile(basicProfile, mediaFile);
//         } catch (error) {
//           profile = await this.profileModel.findOneById(_currentUserId);
//           if (profile) {
//             await this.filesService.updateProfileAfterCreatePhoto(
//               mediaFile,
//               _currentUserId,
//             );
//           }
//           await this.filesService.removeMediaFileAndCatch(mediaFile);
//           throw new NotFoundException(ERROR_MESSAGES['Profile does not exist']);
//         }
//       }
//       return mediaFile;
//     });
//   }

//   async findOneOrFailById(id: string, _client: ClientData) {
//     const _id = this.getObjectId(id);
//     const findResult = await this.profileModel.findOneOrFailById(_id);
//     return findResult;
//   }

//   async tryFindProfileAndBasicProfile(_currentUserId: mongoose.Types.ObjectId) {
//     let [profile, basicProfile] = await Promise.all([
//       this.profileModel.findOneById(_currentUserId),
//       this.basicProfileModel.findOneById(_currentUserId),
//     ]);
//     if (!profile && !basicProfile) {
//       [profile, basicProfile] = await Promise.all([
//         this.profileModel.findOneById(_currentUserId),
//         this.basicProfileModel.findOneById(_currentUserId),
//       ]);
//       if (!profile && !basicProfile) {
//         throw new NotFoundException(ERROR_MESSAGES['Profile does not exist']);
//       }
//     }
//     return { profile, basicProfile };
//   }
// }
