import { app } from './app'
import { env } from './env'

app.listen(env.PORT)

console.log(`API running at ${app.server?.url}`)
