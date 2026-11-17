import { db } from "@app/database";
import { createApp } from "./create-app";
import { createUsersService } from "./modules/users/users.service";

export const app = createApp(createUsersService(db));

export type App = typeof app;
