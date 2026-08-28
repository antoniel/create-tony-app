import { app } from './app'

app.listen(Number(process.env.PORT ?? 3001))

console.log(`API running at ${app.server?.url}`)
