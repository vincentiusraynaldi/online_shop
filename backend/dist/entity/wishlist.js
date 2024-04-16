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
exports.CreateWishlistSchema = exports.Wishlist = void 0;
const _1 = require("./");
const core_1 = require("@mikro-orm/core");
const baseEntity_1 = require("./baseEntity");
const wishlistUserItem_1 = require("./wishlistUserItem");
const yup_1 = require("yup");
let Wishlist = class Wishlist extends baseEntity_1.BaseEntity {
    constructor(wishlistName) {
        super();
        this.items = new core_1.Collection(this);
        this.wishlistName = wishlistName;
    }
};
exports.Wishlist = Wishlist;
__decorate([
    (0, core_1.ManyToOne)({ entity: () => _1.User, inversedBy: (user) => user.wishlists }),
    __metadata("design:type", String)
], Wishlist.prototype, "userId", void 0);
__decorate([
    (0, core_1.ManyToMany)({ entity: () => _1.Item, pivotEntity: () => wishlistUserItem_1.WishlistUserItem }),
    __metadata("design:type", Object)
], Wishlist.prototype, "items", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Wishlist.prototype, "wishlistName", void 0);
exports.Wishlist = Wishlist = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String])
], Wishlist);
//!! need to think about how to implement the wishlist entity
//!! need to think about composition or asosiation of wishlist from user entity
//!! need to think about the relationship between wishlist and item entity (one to many and reference)
exports.CreateWishlistSchema = (0, yup_1.object)({
    wishlistName: (0, yup_1.string)().required(),
});
