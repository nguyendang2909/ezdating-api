// import { Injectable } from '@nestjs/common';
// import moment from 'moment';
// import { UpdateQuery } from 'mongoose';

// import { ApiService } from '../../commons';
// import { GENDERS } from '../../constants';
// import { Gender } from '../../types';
// import { ClientData } from '../auth/auth.type';
// import { Profile, ProfileFilterModel } from '../models';
// import { UpdateMyProfileFilterDto } from '../profile-filters/dto/update-profile-filters.dto';

// @Injectable()
// export class ProfileFiltersService extends ApiService {
//   constructor(
//     // private readonly profileModel: ProfileModel,
//     private readonly profileFilterModel: ProfileFilterModel,
//   ) {
//     super();
//   }

//   public async updateMe(payload: UpdateMyProfileFilterDto, client: ClientData) {
//     const { ...updateDto } = payload;
//     const { _currentUserId } = this.getClient(client);

//     const updateOptions: UpdateQuery<Profile> = {
//       $set: {
//         ...updateDto,
//       },
//     };

//     await this.profileFilterModel.updateOneById(_currentUserId, updateOptions);
//   }

//   getFilterGender(gender: Gender) {
//     if (gender === GENDERS.MALE) {
//       return GENDERS.FEMALE;
//     }

//     return GENDERS.MALE;
//   }

//   getAgeFromBirthday(birthday: Date): number {
//     return moment().diff(birthday, 'years');
//   }
// }
