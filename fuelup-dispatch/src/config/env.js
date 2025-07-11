import { z } from "zod"

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
  VITE_API_BASE_URL: z.string().url("Invalid API Base URL"),
  VITE_APP_NAME: z.string().default("FuelUp Driver"),
})

let parsedEnv
try {
  parsedEnv = EnvSchema.parse({
    NODE_ENV: import.meta.env.VITE_NODE_ENV || "development",
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  })
} catch (error) {
  console.error("❌ Invalid environment configuration:", error)
  throw new Error("Environment validation failed. Check your .env file.")
}

const config = {
  env: parsedEnv.NODE_ENV,
  apiBaseUrl: parsedEnv.VITE_API_BASE_URL,
  appName: parsedEnv.VITE_APP_NAME,
}

export { config }
