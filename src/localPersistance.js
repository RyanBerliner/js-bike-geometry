import { afterMiddleWare } from "./hooks"

export const localPersistance = key => {
  return {
    read: () => JSON.parse(window.localStorage.getItem(key)),
    delete: () => window.localStorage.removeItem(key),
    middleware: afterMiddleWare((_, state) => {
      window.localStorage.setItem(key, JSON.stringify(state));
    }),
  }
}