"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBiggerOrEqual = void 0;
const class_validator_1 = require("class-validator");
function IsBiggerOrEqual(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'is_more_than',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return (typeof value === 'number' &&
                        typeof relatedValue === 'number' &&
                        value > relatedValue);
                },
            },
        });
    };
}
exports.IsBiggerOrEqual = IsBiggerOrEqual;
//# sourceMappingURL=is-more-than.js.map