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
exports.CartItem = void 0;
const core_1 = require("@mikro-orm/core");
const _1 = require("./");
const baseEntity_1 = require("./baseEntity");
let CartItem = class CartItem extends baseEntity_1.BaseEntity {
    constructor(item, quantity) {
        super();
        this.item = item;
        this.quantity = quantity;
    }
};
exports.CartItem = CartItem;
__decorate([
    (0, core_1.ManyToOne)({ entity: () => _1.Item }),
    __metadata("design:type", _1.Item)
], CartItem.prototype, "item", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
exports.CartItem = CartItem = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [_1.Item, Number])
], CartItem);
