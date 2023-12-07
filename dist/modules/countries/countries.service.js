"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CountriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesService = void 0;
const common_1 = require("@nestjs/common");
const async_1 = __importDefault(require("async"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
let CountriesService = CountriesService_1 = class CountriesService {
    constructor(stateModel, countryModel) {
        this.stateModel = stateModel;
        this.countryModel = countryModel;
        this.logger = new common_1.Logger(CountriesService_1.name);
        this.locationsService = axios_1.default.create({
            baseURL: 'https://api.countrystatecity.in/',
            headers: {
                'X-CSCAPI-KEY': process.env.COUNTRY_STATE_CITY_API_KEY,
            },
        });
    }
    async onApplicationBootstrap() {
    }
    async setupCountries() {
        const countries = await this.countryModel.findMany({}, {
            name: 1,
            iso2: 1,
            native: 1,
        });
        fs_1.default.writeFileSync('src/data/countries.json', JSON.stringify(countries, null, 2));
    }
    async setupStates() {
        const countries = await this.countryModel.findMany({}, {
            name: 1,
            iso2: 1,
            native: 1,
        });
        const result = {};
        for (const country of countries) {
            const states = await this.stateModel.findMany({ 'country._id': country._id }, {
                name: 1,
            });
            result[country.iso2] = states;
        }
        fs_1.default.writeFileSync('src/data/states.json', JSON.stringify(result, null, 2));
    }
    async runRemove() {
        console.log(111);
        await Promise.all([
            this.stateModel.deleteMany({ _id: { $exists: true } }),
            this.countryModel.deleteMany({ _id: { $exists: true } }),
        ]);
        console.log(2222);
    }
    async runMigration() {
        this.logger.log('Start run country migaration');
        const { data: countries } = await this.locationsService.get('/v1/countries');
        for (const countryData of countries) {
            console.log(1111);
            try {
                const country = await this.migrateCountry(countryData);
                const { data: states } = await this.locationsService.get(`/v1/countries/${country.iso2}/states`);
                await async_1.default.eachLimit(states, 3, async (state) => {
                    await this.migrateState(state, country);
                });
                console.log(222);
            }
            catch (error) {
                this.logger.error('');
            }
        }
        this.logger.log('Finish run country migration');
    }
    async migrateCountry(country) {
        const { data: countryData } = await this.locationsService.get(`/v1/countries/${country.iso2}`);
        return await this.countryModel.createOne({
            capital: countryData.capital,
            currency: countryData.currency,
            currencyName: countryData.currency_name,
            currencySymbol: countryData.currency_symbol,
            emoji: countryData.emoji,
            emojiU: countryData.emojiU,
            iso2: countryData.iso2,
            iso3: countryData.iso3,
            latitude: countryData.latitude,
            longitude: countryData.longitude,
            name: countryData.name,
            native: countryData.native,
            numericCode: countryData.numeric_code,
            phoneCode: countryData.phonecode,
            region: countryData.region,
            sourceId: countryData.id,
            subregion: countryData.subregion,
            tld: countryData.tld,
            translations: countryData.translations,
        });
    }
    async migrateState(state, country) {
        try {
            const { data: stateData } = await this.locationsService.get(`/v1/countries/${country.iso2}/states/${state.iso2}`);
            await this.stateModel.createOne({
                sourceId: stateData.id,
                name: stateData.name,
                country: country,
                countryCode: stateData.country_code,
                iso2: stateData.iso2,
                type: stateData.type,
                latitude: stateData.latitude,
                longitude: stateData.longitude,
            });
        }
        catch (err) {
            this.logger.error(err);
        }
    }
    async findAll() {
        return await this.countryModel.findMany({});
    }
    async findOneOrFail(iso2) {
        return await this.countryModel.findOneOrFail({
            where: {
                iso2,
            },
        });
    }
};
CountriesService = CountriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.StateModel,
        models_1.CountryModel])
], CountriesService);
exports.CountriesService = CountriesService;
//# sourceMappingURL=countries.service.js.map