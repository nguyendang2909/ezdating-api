import { EducationLevel, Gender, RelationshipGoal, RelationshipStatus } from '../../../types';
export declare class UpdateMyProfileDto {
    birthday?: string;
    company?: string;
    educationLevel?: EducationLevel;
    gender?: Gender;
    height?: number;
    hideAge?: boolean;
    hideDistance?: boolean;
    introduce?: string;
    jobTitle?: string;
    languages: string[];
    latitude?: number;
    longitude?: number;
    nickname?: string;
    relationshipGoal?: RelationshipGoal;
    relationshipStatus: RelationshipStatus;
    school?: string;
    weight: number;
    stateId?: string;
}
