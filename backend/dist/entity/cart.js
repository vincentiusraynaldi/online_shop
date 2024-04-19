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
exports.Cart = void 0;
const core_1 = require("@mikro-orm/core");
const _1 = require("./");
const cartItem_1 = require("./cartItem");
const baseEntity_1 = require("./baseEntity");
let Cart = class Cart extends baseEntity_1.BaseEntity {
    constructor(user) {
        super();
        // Add properties here
        this.items = new core_1.Collection(this);
        this.user = user;
        this.totalPrice = 0;
        this.items = new core_1.Collection(this);
    }
};
exports.Cart = Cart;
__decorate([
    (0, core_1.OneToOne)({ entity: () => _1.User, onDelete: 'cascade' }),
    __metadata("design:type", _1.User)
], Cart.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToMany)({ entity: () => cartItem_1.CartItem }),
    __metadata("design:type", Object)
], Cart.prototype, "items", void 0);
__decorate([
    (0, core_1.Property)({ type: 'decimal', scale: 2 }),
    __metadata("design:type", Number)
], Cart.prototype, "totalPrice", void 0);
exports.Cart = Cart = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [_1.User])
], Cart);
