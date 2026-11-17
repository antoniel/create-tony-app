import { Elysia, t } from "elysia";
import { createUserModel, userModel } from "./users.models";
import type { createUsersService } from "./users.service";

export function createUsersRoute(usersService: ReturnType<typeof createUsersService>) {
  return new Elysia({ prefix: "/users" })
    .get("/", () => usersService.list(), {
      response: t.Array(userModel),
    })
    .post("/", ({ body }) => usersService.create(body), {
      body: createUserModel,
      response: userModel,
    });
}
