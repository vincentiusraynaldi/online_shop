import { userService } from "./userService";
import { DI } from "../di"
import {
    googleClient,
    envGoogleClientId
} from "../app"
import { 
    RegisterUserSchema, 
    LoginUserSchema, 
    User,
    ChangePasswordSchema, 
    EditProfileSchema 
} from "../entity";
import { Auth } from "../middleware/auth.middleware";
import { UserMapper } from "../mapper/userMapper";

jest.mock("../di", () => ({
  DI: {
    userRepository: { findOne: jest.fn() },
    em: {
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
      removeAndFlush: jest.fn(),
    },
  },
}));

jest.mock("../app", () => ({
    envGoogleClientId: "test-client-id",
    googleClient: { verifyIdToken: jest.fn() },
}))

jest.mock("../middleware/auth.middleware", () => ({
  Auth: {
    generateToken: jest.fn(() => "fake-jwt"),
    hashPassword: jest.fn(async (p: string) => `hashed:${p}`),
    comparePasswordwithHash: jest.fn(),
  },
}));

jest.mock("../mapper/userMapper", () => ({
  UserMapper: {
    createUserFromRegisterUserDTO: jest.fn((dto) => ({ id: "1", ...dto })),
    createUserFromRegisterGoogleUserDTO: jest.fn((dto) => ({ id: "g1", ...dto })),
  },
}));

jest.mock("../entity", () => ({
  RegisterUserSchema: { validate: jest.fn() },
  LoginUserSchema: { validate: jest.fn() },
  ChangePasswordSchema: { validate: jest.fn() },
  EditProfileSchema: { validate: jest.fn() },
  RegisterGoogleUserSchema: {},
  User: class {},
}));

it("mocks", () => {
  expect(jest.isMockFunction(DI.userRepository.findOne)).toBe(true);
});

const findOne = DI.userRepository.findOne as jest.Mock;
const compare = Auth.comparePasswordwithHash as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe("userService.registerUser", () => {
    const input = {
    firstName: "A",
    lastName: "B",
    email: "Test@Mail.com",
    password: "secret123",
  };

  it("lower cases, successfully hash the password and persist the user", async () => {

    (RegisterUserSchema.validate as jest.Mock).mockResolvedValue(input);

    findOne.mockResolvedValue(null);

    const result = await userService.registerUser(input);

    expect(findOne).toHaveBeenCalledWith({email: "test@mail.com"});
    expect(UserMapper.createUserFromRegisterUserDTO).toHaveBeenCalledWith(
      expect.objectContaining({email:"test@mail.com", password: "hashed:secret123"}));
    expect(DI.em.persistAndFlush).toHaveBeenCalledTimes(1);
    expect((await result).email).toBe("test@mail.com");
  })

  it("user alr registered", async () => {

    (RegisterUserSchema.validate as jest.Mock).mockResolvedValue(input);

    findOne.mockResolvedValue(true);

    await expect(userService.registerUser(input)).rejects.toThrow("Email already in use");
    expect(DI.em.persistAndFlush).not.toHaveBeenCalled()
  })

  it("validation error", async () => {

    (RegisterUserSchema.validate as jest.Mock).mockRejectedValue(new Error("bad email"));
    await expect(userService.registerUser(input)).rejects.toThrow("bad email");

  })

})

describe("userService.loginUser", () => {
  const creds = { email: "a@b.com", password: "pw" };
  const dbUser = {
    id: "1", email: "a@b.com", firstName: "A", lastName: "B", password: "hash",
  };

  beforeEach(() => (LoginUserSchema.validate as jest.Mock).mockResolvedValue(creds));

  it("throws if user does not exist", async () => {
    findOne.mockResolvedValue(null);
    await expect(userService.loginUser(creds)).rejects.toThrow("Email or Password not found");
  });

  it("throws if user has no password (google account)", async () => {
    findOne.mockResolvedValue({ ...dbUser, password: undefined });
    await expect(userService.loginUser(creds)).rejects.toThrow("Email or Password not found");
  });

  it("throws on wrong password", async () => {
    findOne.mockResolvedValue(dbUser);
    compare.mockResolvedValue(false);
    await expect(userService.loginUser(creds)).rejects.toThrow("Invalid password");
  });

  it("returns token and a user object WITHOUT the password", async () => {
    findOne.mockResolvedValue(dbUser);
    compare.mockResolvedValue(true);

    const result = await userService.loginUser(creds);

    expect(result.token).toBe("fake-jwt");
    expect(result.user).toEqual({
      id: "1", email: "a@b.com", firstName: "A", lastName: "B", isGoogle: false,
    });
    expect(result.user).not.toHaveProperty("password");
  });
});

describe("userService.changePassword", () => {
  const authUser: any = { id: "1" };
  const valid = { currentPassword: "old", newPassword: "new", confirmPassword: "new" };

  it("throws when current password is wrong", async () => {
    (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(valid);
    findOne.mockResolvedValue({ id: "1", password: "hash" });
    compare.mockResolvedValue(false);

    await expect(userService.changePassword(valid, authUser)).rejects.toThrow(
      "Current password is not the same"
    );
  });

  it("throws when new password equals current", async () => {
    const same = { currentPassword: "x", newPassword: "x", confirmPassword: "x" };
    (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(same);
    findOne.mockResolvedValue({ id: "1", password: "hash" });
    compare.mockResolvedValue(true);

    await expect(userService.changePassword(same, authUser)).rejects.toThrow(
      "Current and new password are the same"
    );
  });

  it("throws when confirm does not match", async () => {
    const bad = { currentPassword: "old", newPassword: "new", confirmPassword: "nope" };
    (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(bad);
    findOne.mockResolvedValue({ id: "1", password: "hash" });
    compare.mockResolvedValue(true);

    await expect(userService.changePassword(bad, authUser)).rejects.toThrow(
      "New Password and confirm password not the same"
    );
  });

  it("hashes and saves the new password", async () => {
    const dbUser = { id: "1", password: "hash" };
    (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(valid);
    findOne.mockResolvedValue(dbUser);
    compare.mockResolvedValue(true);

    await userService.changePassword(valid, authUser);

    expect(dbUser.password).toBe("hashed:new");
    expect(DI.em.flush).toHaveBeenCalled();
  });
});

describe("userService.deleteUser", () => {
  it("throws if user not found", async () => {
    findOne.mockResolvedValue(null);
    await expect(userService.deleteUser({ id: "1" } as any)).rejects.toThrow("User not found");
  });

  it("removes the user", async () => {
    const dbUser = { id: "1" };
    findOne.mockResolvedValue(dbUser);

    await expect(userService.deleteUser({ id: "1" } as any)).resolves.toEqual({
      message: "User deleted",
    });
    expect(DI.em.removeAndFlush).toHaveBeenCalledWith(dbUser);
  });
});

describe("userService.verifyGoogleToken", () => {
  const verify = googleClient.verifyIdToken as jest.Mock;
  const payload = { email: "G@Mail.com", given_name: "G", family_name: "U", sub: "sub-1" };

  it("creates a new user when email is unknown", async () => {
    verify.mockResolvedValue({ getPayload: () => payload });
    findOne.mockResolvedValue(null);

    const result = await userService.verifyGoogleToken("cred");

    expect(result.isNewUser).toBe(true);
    expect(DI.em.persistAndFlush).toHaveBeenCalled();
    expect(result.user.isGoogle).toBe(true);
  });

  it("logs in an existing user without creating one", async () => {
    verify.mockResolvedValue({ getPayload: () => payload });
    findOne.mockResolvedValue({ id: "7", email: "g@mail.com", firstName: "G", lastName: "U" });

    const result = await userService.verifyGoogleToken("cred");

    expect(result.isNewUser).toBe(false);
    expect(DI.em.persistAndFlush).not.toHaveBeenCalled();
  });

  it("wraps any failure in a generic error", async () => {
    verify.mockRejectedValue(new Error("boom"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(userService.verifyGoogleToken("cred")).rejects.toThrow(
      "Google authentication failed"
    );
  });
});




























// describe("userService.registerUser", () => {
//   const input = {
//     firstName: "A",
//     lastName: "B",
//     email: "Test@Mail.com",
//     password: "secret123",
//   };

//   it("lowercases email, hashes password and persists the user", async () => {
//     (RegisterUserSchema.validate as jest.Mock).mockResolvedValue(input);
//     findOne.mockResolvedValue(null);

//     const result = await userService.registerUser(input);

//     expect(findOne).toHaveBeenCalledWith({ email: "test@mail.com" });
//     expect(UserMapper.createUserFromRegisterUserDTO).toHaveBeenCalledWith(
//       expect.objectContaining({ email: "test@mail.com", password: "hashed:secret123" })
//     );
//     expect(DI.em.persistAndFlush).toHaveBeenCalledTimes(1);
//     expect(result.email).toBe("test@mail.com");
//   });
// });


//!!
//!!
//!!


// describe("userService.registerUser", () => {
//   const input = {
//     firstName: "A",
//     lastName: "B",
//     email: "Test@Mail.com",
//     password: "secret123",
//   };

//   it("lowercases email, hashes password and persists the user", async () => {
//     (RegisterUserSchema.validate as jest.Mock).mockResolvedValue(input);
//     findOne.mockResolvedValue(null);

//     const result = await userService.registerUser(input);

//     expect(findOne).toHaveBeenCalledWith({ email: "test@mail.com" });
//     expect(UserMapper.createUserFromRegisterUserDTO).toHaveBeenCalledWith(
//       expect.objectContaining({ email: "test@mail.com", password: "hashed:secret123" })
//     );
//     expect(DI.em.persistAndFlush).toHaveBeenCalledTimes(1);
//     expect(result.email).toBe("test@mail.com");
//   });

//   it("throws when the email is already in use", async () => {
//     (RegisterUserSchema.validate as jest.Mock).mockResolvedValue(input);
//     findOne.mockResolvedValue({ id: "existing" });

//     await expect(userService.registerUser(input)).rejects.toThrow("Email already in use");
//     expect(DI.em.persistAndFlush).not.toHaveBeenCalled();
//   });

//   it("propagates validation errors", async () => {
//     (RegisterUserSchema.validate as jest.Mock).mockRejectedValue(new Error("bad email"));
//     await expect(userService.registerUser({})).rejects.toThrow("bad email");
//   });
// });

// describe("userService.loginUser", () => {
//   const creds = { email: "a@b.com", password: "pw" };
//   const dbUser = {
//     id: "1", email: "a@b.com", firstName: "A", lastName: "B", password: "hash",
//   };

//   beforeEach(() => (LoginUserSchema.validate as jest.Mock).mockResolvedValue(creds));

//   it("throws if user does not exist", async () => {
//     findOne.mockResolvedValue(null);
//     await expect(userService.loginUser(creds)).rejects.toThrow("Email or Password not found");
//   });

//   it("throws if user has no password (google account)", async () => {
//     findOne.mockResolvedValue({ ...dbUser, password: undefined });
//     await expect(userService.loginUser(creds)).rejects.toThrow("Email or Password not found");
//   });

//   it("throws on wrong password", async () => {
//     findOne.mockResolvedValue(dbUser);
//     compare.mockResolvedValue(false);
//     await expect(userService.loginUser(creds)).rejects.toThrow("Invalid password");
//   });

//   it("returns token and a user object WITHOUT the password", async () => {
//     findOne.mockResolvedValue(dbUser);
//     compare.mockResolvedValue(true);

//     const result = await userService.loginUser(creds);

//     expect(result.token).toBe("fake-jwt");
//     expect(result.user).toEqual({
//       id: "1", email: "a@b.com", firstName: "A", lastName: "B", isGoogle: false,
//     });
//     expect(result.user).not.toHaveProperty("password");
//   });
// });

// describe("userService.changePassword", () => {
//   const authUser: any = { id: "1" };
//   const valid = { currentPassword: "old", newPassword: "new", confirmPassword: "new" };

//   it("throws when current password is wrong", async () => {
//     (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(valid);
//     findOne.mockResolvedValue({ id: "1", password: "hash" });
//     compare.mockResolvedValue(false);

//     await expect(userService.changePassword(valid, authUser)).rejects.toThrow(
//       "Current password is not the same"
//     );
//   });

//   it("throws when new password equals current", async () => {
//     const same = { currentPassword: "x", newPassword: "x", confirmPassword: "x" };
//     (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(same);
//     findOne.mockResolvedValue({ id: "1", password: "hash" });
//     compare.mockResolvedValue(true);

//     await expect(userService.changePassword(same, authUser)).rejects.toThrow(
//       "Current and new password are the same"
//     );
//   });

//   it("throws when confirm does not match", async () => {
//     const bad = { currentPassword: "old", newPassword: "new", confirmPassword: "nope" };
//     (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(bad);
//     findOne.mockResolvedValue({ id: "1", password: "hash" });
//     compare.mockResolvedValue(true);

//     await expect(userService.changePassword(bad, authUser)).rejects.toThrow(
//       "New Password and confirm password not the same"
//     );
//   });

//   it("hashes and saves the new password", async () => {
//     const dbUser = { id: "1", password: "hash" };
//     (ChangePasswordSchema.validate as jest.Mock).mockResolvedValue(valid);
//     findOne.mockResolvedValue(dbUser);
//     compare.mockResolvedValue(true);

//     await userService.changePassword(valid, authUser);

//     expect(dbUser.password).toBe("hashed:new");
//     expect(DI.em.flush).toHaveBeenCalled();
//   });
// });

// describe("userService.deleteUser", () => {
//   it("throws if user not found", async () => {
//     findOne.mockResolvedValue(null);
//     await expect(userService.deleteUser({ id: "1" } as any)).rejects.toThrow("User not found");
//   });

//   it("removes the user", async () => {
//     const dbUser = { id: "1" };
//     findOne.mockResolvedValue(dbUser);

//     await expect(userService.deleteUser({ id: "1" } as any)).resolves.toEqual({
//       message: "User deleted",
//     });
//     expect(DI.em.removeAndFlush).toHaveBeenCalledWith(dbUser);
//   });
// });

// describe("userService.verifyGoogleToken", () => {
//   const verify = googleClient.verifyIdToken as jest.Mock;
//   const payload = { email: "G@Mail.com", given_name: "G", family_name: "U", sub: "sub-1" };

//   it("creates a new user when email is unknown", async () => {
//     verify.mockResolvedValue({ getPayload: () => payload });
//     findOne.mockResolvedValue(null);

//     const result = await userService.verifyGoogleToken("cred");

//     expect(result.isNewUser).toBe(true);
//     expect(DI.em.persistAndFlush).toHaveBeenCalled();
//     expect(result.user.isGoogle).toBe(true);
//   });

//   it("logs in an existing user without creating one", async () => {
//     verify.mockResolvedValue({ getPayload: () => payload });
//     findOne.mockResolvedValue({ id: "7", email: "g@mail.com", firstName: "G", lastName: "U" });

//     const result = await userService.verifyGoogleToken("cred");

//     expect(result.isNewUser).toBe(false);
//     expect(DI.em.persistAndFlush).not.toHaveBeenCalled();
//   });

//   it("wraps any failure in a generic error", async () => {
//     verify.mockRejectedValue(new Error("boom"));
//     jest.spyOn(console, "error").mockImplementation(() => {});

//     await expect(userService.verifyGoogleToken("cred")).rejects.toThrow(
//       "Google authentication failed"
//     );
//   });
// });