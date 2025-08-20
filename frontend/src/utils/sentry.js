import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    beforeSend(event) {
      if (import.meta.env.MODE === "development") {
        console.log("Sentry Event:", event)
      }
      return event
    },
  })
}

export const captureException = (error, context = {}) => {
  Sentry.captureException(error, { contexts: { custom: context } })
}

export const captureMessage = (message, level = "info") => {
  Sentry.captureMessage(message, level)
}
