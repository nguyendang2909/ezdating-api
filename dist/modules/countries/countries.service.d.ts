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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { Country, CountryModel, StateModel } from '../models';
import { CountryOfCountriesResponse } from './countries.type';
export declare class CountriesService {
    private readonly stateModel;
    private readonly countryModel;
    constructor(stateModel: StateModel, countryModel: CountryModel);
    private readonly logger;
    onApplicationBootstrap(): Promise<void>;
    setupCountries(): Promise<void>;
    setupStates(): Promise<void>;
    runRemove(): Promise<void>;
    runMigration(): Promise<void>;
    migrateCountry(country: CountryOfCountriesResponse): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Country> & Country & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>>;
    private migrateState;
    private readonly locationsService;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Country> & Country & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>> & import("mongoose").Document<unknown, {}, Country> & Country & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOneOrFail(iso2: string): Promise<Country>;
}
