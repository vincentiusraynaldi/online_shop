import { categoryService } from "../service/categoryService";
import { DI } from "../di";
import { Category } from "../entity";

jest.mock("../di", () => ({
  DI: {
    categoryRepository: {
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
    itemRepository: {
      findOne: jest.fn(),
    },
    em: {
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
      removeAndFlush: jest.fn(),
    },
  },
}));

jest.mock("../entity", () => ({
  // a fake class: remembers the name it was constructed with
  Category: jest.fn().mockImplementation(function (this: any, categoryName: string) {
    this.categoryName = categoryName;
  }),
}));

const categoryFindOne = jest.mocked(DI.categoryRepository.findOne);
const categoryFindAll = jest.mocked(DI.categoryRepository.findAll);
const itemFindOne = jest.mocked(DI.itemRepository.findOne);

// jest.clearAllMocks() keeps implementations, which is what we want for Category
beforeEach(() => jest.clearAllMocks());

describe("categoryService.getCategories", () => {
  it("returns everything from findAll", async () => {
    const all = [{ id: "1" }, { id: "2" }];
    categoryFindAll.mockResolvedValue(all as any);

    await expect(categoryService.getCategories()).resolves.toBe(all);
  });
});

describe("categoryService.getCategoryById", () => {
  it("looks up by id and populates items", async () => {
    const cat = { id: "1" };
    categoryFindOne.mockResolvedValue(cat as any);

    const result = await categoryService.getCategoryById("1");

    expect(result).toBe(cat);
    expect(categoryFindOne).toHaveBeenCalledWith({ id: "1" }, { populate: ["items"] });
  });

  it("returns null when not found", async () => {
    categoryFindOne.mockResolvedValue(null);
    await expect(categoryService.getCategoryById("x")).resolves.toBeNull();
  });
});

describe("categoryService.addCategory", () => {
  it("throws when the name is empty", async () => {
    await expect(categoryService.addCategory("")).rejects.toThrow(
      "Category name is required"
    );
    expect(categoryFindOne).not.toHaveBeenCalled();
  });

  it("throws when the category already exists", async () => {
    categoryFindOne.mockResolvedValue({ id: "existing" } as any);

    await expect(categoryService.addCategory("Shoes")).rejects.toThrow(
      "Category already exists"
    );
    expect(categoryFindOne).toHaveBeenCalledWith({ categoryName: "Shoes" });
    expect(DI.em.persistAndFlush).not.toHaveBeenCalled();
  });

  it("creates and persists a new category", async () => {
    categoryFindOne.mockResolvedValue(null);

    const result = await categoryService.addCategory("Shoes");

    expect(Category).toHaveBeenCalledWith("Shoes");
    expect(DI.em.persistAndFlush).toHaveBeenCalledWith(result);
    expect(result).toMatchObject({ categoryName: "Shoes" });
  });
});

describe("categoryService.deleteCategory", () => {
  it("throws when the category does not exist", async () => {
    categoryFindOne.mockResolvedValue(null);

    await expect(categoryService.deleteCategory("1")).rejects.toThrow(
      "Category not found"
    );
    expect(DI.em.removeAndFlush).not.toHaveBeenCalled();
  });

  it("removes the category and returns a message", async () => {
    const cat = { id: "1" };
    categoryFindOne.mockResolvedValue(cat as any);

    await expect(categoryService.deleteCategory("1")).resolves.toEqual({
      message: "Category deleted",
    });
    expect(DI.em.removeAndFlush).toHaveBeenCalledWith(cat);
  });
});

describe("categoryService.updateCategory", () => {
  it("throws when the category does not exist", async () => {
    categoryFindOne.mockResolvedValue(null);

    await expect(
      categoryService.updateCategory("1", { categoryName: "New" })
    ).rejects.toThrow("Category not found");
  });

  it("throws when categoryName is missing", async () => {
    categoryFindOne.mockResolvedValue({ id: "1" } as any);

    await expect(categoryService.updateCategory("1", {})).rejects.toThrow(
      "Category name is required"
    );
    expect(DI.em.flush).not.toHaveBeenCalled();
  });

  it("applies the changes, flushes and returns the category", async () => {
    const cat: any = { id: "1", categoryName: "Old" };
    categoryFindOne.mockResolvedValue(cat);

    const result = await categoryService.updateCategory("1", { categoryName: "New" });

    expect(result).toBe(cat);
    expect(cat.categoryName).toBe("New");
    expect(DI.em.flush).toHaveBeenCalledTimes(1);
  });
});

describe("categoryService.addItemToCategory", () => {
  it("throws when the item does not exist", async () => {
    itemFindOne.mockResolvedValue(null);

    await expect(categoryService.addItemToCategory("c1", "i1")).rejects.toThrow(
      "Item not found"
    );
    expect(categoryFindOne).not.toHaveBeenCalled();
  });

  it("throws when the category does not exist", async () => {
    itemFindOne.mockResolvedValue({ id: "i1" } as any);
    categoryFindOne.mockResolvedValue(null);

    await expect(categoryService.addItemToCategory("c1", "i1")).rejects.toThrow(
      "Category not found"
    );
    expect(DI.em.flush).not.toHaveBeenCalled();
  });

  it("adds the item to the category collection and flushes", async () => {
    const item = { id: "i1" };
    const cat = { id: "c1", items: { add: jest.fn(), remove: jest.fn() } };
    itemFindOne.mockResolvedValue(item as any);
    categoryFindOne.mockResolvedValue(cat as any);

    const result = await categoryService.addItemToCategory("c1", "i1");

    expect(itemFindOne).toHaveBeenCalledWith({ id: "i1" });
    expect(categoryFindOne).toHaveBeenCalledWith({ id: "c1" }, { populate: ["items"] });
    expect(cat.items.add).toHaveBeenCalledWith(item);
    expect(DI.em.flush).toHaveBeenCalledTimes(1);
    expect(result).toBe(cat);
  });
});

describe("categoryService.deleteItemFromCategory", () => {
  it("throws when the item does not exist", async () => {
    itemFindOne.mockResolvedValue(null);

    await expect(categoryService.deleteItemFromCategory("c1", "i1")).rejects.toThrow(
      "Item not found"
    );
  });

  it("throws when the category does not exist", async () => {
    itemFindOne.mockResolvedValue({ id: "i1" } as any);
    categoryFindOne.mockResolvedValue(null);

    await expect(categoryService.deleteItemFromCategory("c1", "i1")).rejects.toThrow(
      "Category not found"
    );
  });

  it("removes the item from the category collection and flushes", async () => {
    const item = { id: "i1" };
    const cat = { id: "c1", items: { add: jest.fn(), remove: jest.fn() } };
    itemFindOne.mockResolvedValue(item as any);
    categoryFindOne.mockResolvedValue(cat as any);

    const result = await categoryService.deleteItemFromCategory("c1", "i1");

    expect(cat.items.remove).toHaveBeenCalledWith(item);
    expect(cat.items.add).not.toHaveBeenCalled();
    expect(DI.em.flush).toHaveBeenCalledTimes(1);
    expect(result).toBe(cat);
  });
});