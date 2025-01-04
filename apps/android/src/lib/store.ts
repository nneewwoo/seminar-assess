import { derived, writable, get as getFromStore } from 'svelte/store'

type Any = string | number | boolean

export const createMapStore = (initial: Map<string, Any> = new Map()) => {
  const store = writable<Map<string, Any>>(initial)

  const set = (key: string, value: Any) => {
    store.update((map) => {
      const newMap = new Map(map)
      newMap.set(key, value)
      return newMap
    })
  }

  const get = <T>(key: string): T | undefined => {
    return getFromStore(store).get(key) as T
  }

  const remove = (key: string) => {
    store.update((map) => {
      const newMap = new Map(map)
      newMap.delete(key)
      return newMap
    })
  }

  const results = derived(store, (map) => ({
    keys: Array.from(map.keys()),
    values: Array.from(map.values()),
    entries: Array.from(map.entries()),
    set,
    remove
  }))

  return {
    subscribe: results.subscribe,
    set,
    get,
    remove
  }
}

export const store = createMapStore()
