export function createHost() {
  return {
    call(name) {
      throw new Error(`The ${name} browser host call requires a browser.`)
    },
  }
}
