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
exports.Category = void 0;
const core_1 = require("@mikro-orm/core");
const baseEntity_1 = require("./baseEntity");
const core_2 = require("@mikro-orm/core");
const item_1 = require("./item");
const category_item_1 = require("./category_item");
let Category = class Category extends baseEntity_1.BaseEntity {
    constructor(categoryName) {
        super();
        this.items = new core_1.Collection(this);
        this.categoryName = categoryName;
    }
};
exports.Category = Category;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Category.prototype, "categoryName", void 0);
__decorate([
    (0, core_1.ManyToMany)({ entity: () => item_1.Item, pivotEntity: () => category_item_1.CategoryItem,
        inversedBy: (item) => item.categories }),
    __metadata("design:type", Object)
], Category.prototype, "items", void 0);
exports.Category = Category = __decorate([
    (0, core_2.Entity)(),
    __metadata("design:paramtypes", [String])
], Category);
