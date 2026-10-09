import { itemService } from "../service/itemService";
import { DI } from "../di";
import { CreateItemSchema } from "../entity";
import { itemMapper } from "../mapper";

jest.mock("../di", () => ({
  DI: {
    itemRepository: {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
    },
    em: {
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
      removeAndFlush: jest.fn(),
    },
  },
}));

jest.mock("../entity", () => ({
  CreateItemSchema: { validate: jest.fn() },
}));

jest.mock("../mapper", () => ({
  itemMapper: {
    createItemFromDTO: jest.fn((dto) => ({ id: "i1", ...dto })),
  },
}));

const findOne = jest.mocked(DI.itemRepository.findOne);
const findAndCount = jest.mocked(DI.itemRepository.findAndCount);
const validate = CreateItemSchema.validate as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {}); // service has a console.log
  findAndCount.mockResolvedValue([[], 0] as any);
});

describe("itemService.getAllItems", () => {
  // helper: the (where, options) the service passed to findAndCount
  const lastCall = () => {
    const [where, options] = findAndCount.mock.calls[0] as any[];
    return { where, options };
  };

  it("uses an empty filter and default sorting when there is no query", async () => {
    await itemService.getAllItems({});

    const { where, options } = lastCall();
    expect(where).toEqual({});
    expect(options.orderBy).toEqual({ itemName: "ASC" });
    expect(options.offset).toBeUndefined();
    expect(options.populate).toEqual(["categories"]);
  });

  it("filters by name with a case-insensitive partial match", async () => {
    await itemService.getAllItems({ name: "shoe" });
    expect(lastCall().where.itemName).toEqual({ $ilike: "%shoe%" });
  });

  it("filters by brand with a case-insensitive partial match", async () => {
    await itemService.getAllItems({ brand: "nike" });
    expect(lastCall().where.itemBrand).toEqual({ $ilike: "%nike%" });
  });

  describe("categories", () => {
    it("wraps a single category string in an array", async () => {
      await itemService.getAllItems({ categories: "shoes" });
      expect(lastCall().where.$and).toEqual([
        { categories: { $some: { category_name: "shoes" } } },
      ]);
    });

    it("creates one condition per category when given an array", async () => {
      await itemService.getAllItems({ categories: ["shoes", "sale"] });
      expect(lastCall().where.$and).toEqual([
        { categories: { $some: { category_name: "shoes" } } },
        { categories: { $some: { category_name: "sale" } } },
      ]);
    });
  });

  describe("price range", () => {
    it("applies both bounds as numbers", async () => {
      await itemService.getAllItems({ minPrice: "10.5", maxPrice: "99" });
      expect(lastCall().where.itemPrice).toEqual({ $gte: 10.5, $lte: 99 });
    });

    it("applies only minPrice when maxPrice is missing", async () => {
      await itemService.getAllItems({ minPrice: "10" });
      expect(lastCall().where.itemPrice).toEqual({ $gte: 10 });
    });

    it("applies only maxPrice when minPrice is missing", async () => {
      await itemService.getAllItems({ maxPrice: "50" });
      expect(lastCall().where.itemPrice).toEqual({ $lte: 50 });
    });
  });

  describe("inStock", () => {
    it('filters availableStock > 0 when inStock is "true"', async () => {
      await itemService.getAllItems({ inStock: "true" });
      expect(lastCall().where.availableStock).toEqual({ $gt: 0 });
    });

    it('does not filter when inStock is "false"', async () => {
      await itemService.getAllItems({ inStock: "false" });
      expect(lastCall().where).not.toHaveProperty("availableStock");
    });
  });

  it("uses custom sortBy and sortOrder", async () => {
    await itemService.getAllItems({ sortBy: "itemPrice", sortOrder: "DESC" });
    expect(lastCall().options.orderBy).toEqual({ itemPrice: "DESC" });
  });

  describe("pagination", () => {
    it("computes offset from page and limit", async () => {
      await itemService.getAllItems({ page: "3", limit: "10" });
      expect(lastCall().options.offset).toBe(20);
    });

    it("leaves offset undefined if only page is given", async () => {
      await itemService.getAllItems({ page: "3" });
      expect(lastCall().options.offset).toBeUndefined();
    });

    it("returns the items with pagination info", async () => {
      const items = [{ id: "1" }, { id: "2" }];
      findAndCount.mockResolvedValue([items, 25] as any);

      const result = await itemService.getAllItems({ page: 1, limit: 10 });

      expect(result.data).toBe(items);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3, // ceil(25 / 10)
      });
    });
  });
});

describe("itemService.getItemById", () => {
  it("looks the item up by id and returns it", async () => {
    const item = { id: "1" };
    findOne.mockResolvedValue(item as any);

    await expect(itemService.getItemById("1")).resolves.toBe(item);
    expect(findOne).toHaveBeenCalledWith("1");
  });

  it("returns null when nothing is found", async () => {
    findOne.mockResolvedValue(null);
    await expect(itemService.getItemById("x")).resolves.toBeNull();
  });
});

describe("itemService.addItem", () => {
  const input = { itemName: "Shoe", itemPrice: 10 };

  it("throws when validation returns nothing", async () => {
    validate.mockResolvedValue(undefined);
    await expect(itemService.addItem(input)).rejects.toThrow("Invalid data");
  });

  it("propagates validation errors", async () => {
    validate.mockRejectedValue(new Error("itemName is required"));
    await expect(itemService.addItem({})).rejects.toThrow("itemName is required");
  });

  it("throws when an item with the same name already exists", async () => {
    validate.mockResolvedValue(input);
    findOne.mockResolvedValue({ id: "existing" } as any);

    await expect(itemService.addItem(input)).rejects.toThrow("Item already exists");
    expect(findOne).toHaveBeenCalledWith({ itemName: "Shoe" });
    expect(DI.em.persistAndFlush).not.toHaveBeenCalled();
  });

  it("creates and persists the item, defaulting categories to []", async () => {
    validate.mockResolvedValue(input);
    findOne.mockResolvedValue(null);

    const result = await itemService.addItem(input);

    expect(itemMapper.createItemFromDTO).toHaveBeenCalledWith(
      expect.objectContaining({ itemName: "Shoe", categories: [] })
    );
    expect(DI.em.persistAndFlush).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ id: "i1", itemName: "Shoe" });
  });

  it("passes categories from the raw data to the mapper", async () => {
    const withCats = { ...input, categories: ["c1", "c2"] };
    validate.mockResolvedValue(input);
    findOne.mockResolvedValue(null);

    await itemService.addItem(withCats);

    expect(itemMapper.createItemFromDTO).toHaveBeenCalledWith(
      expect.objectContaining({ categories: ["c1", "c2"] })
    );
  });
});

describe("itemService.editItem", () => {
  it("throws when the item does not exist", async () => {
    findOne.mockResolvedValue(null);

    await expect(itemService.editItem("1", { itemName: "New" })).rejects.toThrow(
      "Item not found"
    );
    expect(DI.em.flush).not.toHaveBeenCalled();
  });

  it("applies the changes, flushes and returns the item", async () => {
    const dbItem: any = { id: "1", itemName: "Old", itemPrice: 5 };
    findOne.mockResolvedValue(dbItem);

    const result = await itemService.editItem("1", { itemName: "New" });

    expect(findOne).toHaveBeenCalledWith({ id: "1" });
    expect(result).toBe(dbItem);
    expect(dbItem).toMatchObject({ itemName: "New", itemPrice: 5 });
    expect(DI.em.flush).toHaveBeenCalledTimes(1);
  });
});

describe("itemService.deleteItem", () => {
  it("throws when the item does not exist", async () => {
    findOne.mockResolvedValue(null);

    await expect(itemService.deleteItem("1")).rejects.toThrow("Item not found");
    expect(DI.em.removeAndFlush).not.toHaveBeenCalled();
  });

  it("removes the item and returns it", async () => {
    const dbItem = { id: "1" };
    findOne.mockResolvedValue(dbItem as any);

    const result = await itemService.deleteItem("1");

    expect(DI.em.removeAndFlush).toHaveBeenCalledWith(dbItem);
    expect(result).toBe(dbItem);
  });
});