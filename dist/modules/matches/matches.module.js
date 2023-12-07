"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
const chats_module_1 = require("../chats/chats.module");
const models_module_1 = require("../models/models.module");
const matches_consumer_1 = require("./matches.consumer");
const matches_controller_1 = require("./matches.controller");
const matches_handler_1 = require("./matches.handler");
const matches_publisher_1 = require("./matches.publisher");
const matches_service_1 = require("./matches.service");
let MatchesModule = class MatchesModule {
};
MatchesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            models_module_1.ModelsModule,
            chats_module_1.ChatsModule,
            bull_1.BullModule.registerQueue({ name: constants_1.BULL_QUEUE_EVENTS.MATCHES }),
        ],
        exports: [],
        controllers: [matches_controller_1.MatchesController],
        providers: [
            matches_service_1.MatchesService,
            matches_publisher_1.MatchesPublisher,
            matches_handler_1.MatchesHandler,
            matches_consumer_1.MatchesConsumer,
        ],
    })
], MatchesModule);
exports.MatchesModule = MatchesModule;
//# sourceMappingURL=matches.module.js.map