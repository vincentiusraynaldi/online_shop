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
exports.RegisterGoogleUserSchema = exports.LoginUserSchema = exports.RegisterUserSchema = exports.User = void 0;
const core_1 = require("@mikro-orm/core");
const baseEntity_1 = require("./baseEntity");
const yup_1 = require("yup");
const _1 = require("./");
let User = class User extends baseEntity_1.BaseEntity {
    constructor(
    // email: string,
    // firstName: string,
    // lastName: string,
    // password?: string,
    // address?: string,
    // city?: string,
    // country?: string,
    // postalCode?: string,
    // phoneNumber?: string
    ) {
        super();
        this.wishlists = new core_1.Collection(this);
        this.cart = new _1.Cart(this);
        this.orders = new core_1.Collection(this);
        this.addresses = new core_1.Collection(this);
        // this.email = email;
        // this.firstName = firstName;
        // this.lastName = lastName;
        // this.password = password;
        // this.address = address;
        // this.city = city;
        // this.country = country;
        // this.postalCode = postalCode;
        // this.phoneNumber = phoneNumber;
    }
};
exports.User = User;
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => _1.Wishlist, mappedBy: 'user', orphanRemoval: true }),
    __metadata("design:type", Object)
], User.prototype, "wishlists", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => _1.Cart, owner: true, nullable: true, orphanRemoval: true }),
    __metadata("design:type", Object)
], User.prototype, "cart", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => _1.Order, mappedBy: 'user' }),
    __metadata("design:type", Object)
], User.prototype, "orders", void 0);
__decorate([
    (0, core_1.ManyToMany)({ entity: () => _1.Address, owner: true, inversedBy: 'users' }),
    __metadata("design:type", Object)
], User.prototype, "addresses", void 0);
exports.User = User = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], User);
exports.RegisterUserSchema = (0, yup_1.object)({
    password: (0, yup_1.string)().required(),
    email: (0, yup_1.string)().required(),
    firstName: (0, yup_1.string)().required(),
    lastName: (0, yup_1.string)().required(),
});
exports.LoginUserSchema = (0, yup_1.object)({
    password: (0, yup_1.string)().required(),
    email: (0, yup_1.string)().required(),
});
exports.RegisterGoogleUserSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().required(),
    firstName: (0, yup_1.string)().required(),
    lastName: (0, yup_1.string)().required(),
    googleId: (0, yup_1.string)().required(),
});
