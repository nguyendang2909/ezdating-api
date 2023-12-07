import { Gender, RelationshipGoal } from '../../../types';
export declare class CreateBasicProfileDto {
    birthday: string;
    gender: Gender;
    introduce?: string;
    nickname: string;
    relationshipGoal: RelationshipGoal;
    stateId: string;
    latitude?: number;
    longitude?: number;
}
