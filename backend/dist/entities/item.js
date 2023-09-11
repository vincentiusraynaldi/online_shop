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
exports.Item = void 0;
const core_1 = require("@mikro-orm/core");
const baseEntity_1 = require("./baseEntity");
let Item = class Item extends baseEntity_1.BaseEntity {
    constructor({ itemName, itemDescription, itemPrice, itemWeight, itemBrand, itemCategory }) {
        super();
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemPrice = itemPrice;
        this.itemWeight = itemWeight;
        this.itemBrand = itemBrand;
        this.itemCategory = itemCategory;
    }
    ;
};
exports.Item = Item;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Item.prototype, "itemName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Item.prototype, "itemDescription", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Item.prototype, "itemPrice", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Item.prototype, "itemWeight", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Item.prototype, "itemBrand", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Item.prototype, "itemCategory", void 0);
exports.Item = Item = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Item);
