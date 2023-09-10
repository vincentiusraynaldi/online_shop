"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const core_1 = require("@mikro-orm/core");
const baseEntity_1 = require("./baseEntity");
let Item = exports.Item = class Item extends baseEntity_1.BaseEntity {
    constructor({ itemName, itemDescription, itemPrice, itemWeight }) {
        super();
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemPrice = itemPrice;
        this.itemWeight = itemWeight;
    }
    ;
};
__decorate([
    (0, core_1.Property)()
], Item.prototype, "itemName", void 0);
__decorate([
    (0, core_1.Property)()
], Item.prototype, "itemDescription", void 0);
__decorate([
    (0, core_1.Property)()
], Item.prototype, "itemPrice", void 0);
__decorate([
    (0, core_1.Property)()
], Item.prototype, "itemWeight", void 0);
exports.Item = Item = __decorate([
    (0, core_1.Entity)()
], Item);
