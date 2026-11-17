import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import type { ElysiaAdapter } from "elysia";
import { healthRoute } from "./modules/health";
import { createUsersRoute } from "./modules/users/users.route";
import type { createUsersService } from "./modules/users/users.service";

export function createApp(
  usersService: ReturnType<typeof createUsersService>,
  adapter?: ElysiaAdapter,
) {
  // Workers cannot generate code from strings while handling a request.
  return new Elysia({ adapter, aot: !adapter, normalize: adapter ? false : undefined })
    .use(cors())
    .use(healthRoute)
    .use(createUsersRoute(usersService));
}
