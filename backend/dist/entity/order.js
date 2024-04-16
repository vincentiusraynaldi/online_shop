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
const user_1 = require("./user");
const address_1 = require("./address");
const orderItem_1 = require("./orderItem");
let Order = class Order extends baseEntity_1.BaseEntity {
    constructor(totalPrice) {
        super();
        this.items = new core_1.Collection(this);
        this.totalPrice = totalPrice;
    }
};
exports.Order = Order;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Order.prototype, "totalPrice", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => user_1.User }),
    __metadata("design:type", user_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToMany)({ entity: () => orderItem_1.OrderItem }),
    __metadata("design:type", Object)
], Order.prototype, "items", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", address_1.Address)
], Order.prototype, "address", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Order.prototype, "orderStatus", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
exports.Order = Order = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Number])
], Order);
