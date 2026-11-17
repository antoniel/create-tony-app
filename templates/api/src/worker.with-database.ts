import { createDatabase } from "@app/database/cloudflare";
import { WebStandardAdapter } from "elysia/adapter/web-standard";
import type { D1Database } from "@cloudflare/workers-types";
import { createApp } from "./create-app";
import { createUsersService } from "./modules/users/users.service";

export default {
  fetch(request: Request, env: { DB: D1Database }) {
    const app = createApp(createUsersService(createDatabase(env.DB)), WebStandardAdapter);
    return app.fetch(request);
  },
};
