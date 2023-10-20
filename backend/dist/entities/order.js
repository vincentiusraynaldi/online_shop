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
exports.Order = void 0;
const core_1 = require("@mikro-orm/core");
const baseEntity_1 = require("./baseEntity");
const item_1 = require("./item");
const user_1 = require("./user");
let Order = class Order extends baseEntity_1.BaseEntity {
    //address
    //payment method
    constructor(totalPrice) {
        super();
        this.totalPrice = totalPrice;
    }
};
exports.Order = Order;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Order.prototype, "totalPrice", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => user_1.User),
    __metadata("design:type", user_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => item_1.Item),
    __metadata("design:type", item_1.Item)
], Order.prototype, "item", void 0);
exports.Order = Order = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Number])
], Order);
