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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewAddressSchema = exports.Address = void 0;
const core_1 = require("@mikro-orm/core");
const baseEntity_1 = require("./baseEntity");
const _1 = require("./");
const yup_1 = require("yup");
let Address = class Address extends baseEntity_1.BaseEntity {
    constructor() {
        super();
        this.users = new core_1.Collection(this);
    }
};
exports.Address = Address;
__decorate([
    (0, core_1.ManyToMany)({ entity: () => _1.User }),
    __metadata("design:type", Object)
], Address.prototype, "users", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "houseNumber", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "postalCode", void 0);
exports.Address = Address = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], Address);
exports.CreateNewAddressSchema = (0, yup_1.object)({
    street: (0, yup_1.string)().required(),
    houseNumber: (0, yup_1.string)().required(),
    city: (0, yup_1.string)().required(),
    country: (0, yup_1.string)().required(),
    postalCode: (0, yup_1.string)().required()
});
