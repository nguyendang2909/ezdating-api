"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const nest_winston_1 = require("nest-winston");
const redis_io_adapter_1 = require("./adapters/redis-io.adapter");
const app_module_1 = require("./app.module");
const custom_return_fields_interceptor_1 = require("./middlewares/custom-return-fields.interceptor");
const https_exception_filter_1 = require("./middlewares/https-exception.filter");
const logger = new common_1.Logger('Index');
const NODE_ENV = process.env.NODE_ENV;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, Object.assign(Object.assign({}, (NODE_ENV === 'development'
        ? {
            httpsOptions: {
                key: fs_1.default.readFileSync('./.cert/key.pem'),
                cert: fs_1.default.readFileSync('./.cert/cert.pem'),
            },
        }
        : {})), { logger: NODE_ENV === 'production'
            ? ['error', 'warn']
            : ['log', 'debug', 'error', 'verbose', 'warn'] }));
    const API_PORT = process.env.API_PORT;
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: true,
    }));
    app.useGlobalFilters(new https_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new custom_return_fields_interceptor_1.CustomReturnFieldsInterceptor());
    if (NODE_ENV === 'development' || NODE_ENV === 'staging') {
        createSwagger(app);
    }
    const redisIoAdapter = new redis_io_adapter_1.RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);
    await app.listen(API_PORT);
    mongoose_1.default.set('debug', (collectionName, method, query, doc) => {
        logger.log(`${collectionName}.${method} , ${JSON.stringify(query)}, ${JSON.stringify(doc)}`);
    });
}
function createSwagger(app) {
    const options = new swagger_1.DocumentBuilder()
        .setTitle('vMessage')
        .setDescription('Chat application')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .addServer('/', 'Server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('swagger', app, document);
}
bootstrap();
process.on('unhandledRejection', (error, cb) => {
    logger.error(error);
});
//# sourceMappingURL=index.js.map