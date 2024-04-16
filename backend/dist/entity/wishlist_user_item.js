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
exports.WishlistUserItem = void 0;
const core_1 = require("@mikro-orm/core");
const _1 = require("./");
let WishlistUserItem = class WishlistUserItem {
    constructor(wishlist, user, items) {
        this.items = new Set;
        this.wishlist = wishlist;
        this.user = user;
        this.items = items;
    }
};
exports.WishlistUserItem = WishlistUserItem;
__decorate([
    (0, core_1.ManyToOne)({ entity: () => _1.Wishlist, primary: true }),
    __metadata("design:type", _1.Wishlist)
], WishlistUserItem.prototype, "wishlist", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => _1.User, primary: true }),
    __metadata("design:type", _1.User)
], WishlistUserItem.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => _1.Item, primary: true }),
    __metadata("design:type", Object)
], WishlistUserItem.prototype, "items", void 0);
exports.WishlistUserItem = WishlistUserItem = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [_1.Wishlist, _1.User, Set])
], WishlistUserItem);
