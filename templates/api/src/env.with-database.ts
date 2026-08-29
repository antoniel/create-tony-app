import { Elysia, t, type Static } from 'elysia'

export const envSchema = t.Object({
  PORT: t.Numeric(),
  DATABASE_URL: t.String({ minLength: 1 }),
})

export type Env = Static<typeof envSchema>

new Elysia({ name: 'env' }).env(envSchema)

export const env: Env = {
  PORT: Number(process.env.PORT),
  DATABASE_URL: String(process.env.DATABASE_URL),
}
