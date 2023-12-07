import { Gender, RelationshipGoal } from '../../../types';
export declare class UpdateProfileFilterDto {
    gender?: Gender;
    maxDistance?: number;
    minAge?: number;
    maxAge?: number;
    relationshipGoal?: RelationshipGoal;
}
