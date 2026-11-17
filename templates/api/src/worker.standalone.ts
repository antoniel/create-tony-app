import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { WebStandardAdapter } from "elysia/adapter/web-standard";
import { healthRoute } from "./modules/health";

const app = new Elysia({ adapter: WebStandardAdapter, aot: false, normalize: false })
  .use(cors())
  .use(healthRoute);

export default { fetch: (request: Request) => app.fetch(request) };
