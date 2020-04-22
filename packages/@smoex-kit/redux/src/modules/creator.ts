import * as React from 'react'
import { injectReducers } from './injector'
import produce from 'immer'
import cloneDeep from 'lodash/cloneDeep'
import { useScopedAction, useScopedSelector, usePreviousForNull } from './hooks'
import { toArray } from '@bsk/js'

export function createLazyComponent(opts: any) {
  const { loader, injector } = opts
  return React.lazy(() => {
    toArray(injector).forEach((inject) => {
      inject()
    })
    return loader()
  })
}
export function createSlice(name: string, reducers: any) {
  return {
    selector: (select: any) => (state: any) => select(state[name]),
    injector: () => {
      injectReducers(name, reducers)
    },
    useAction: (action: any, deps?: any) => {
      return useScopedAction(name, action, deps)
    },
    useSelector: (selector: any) => {
      const data = useScopedSelector(name, selector)
      const cache = usePreviousForNull(data)
      return [data, data || cache]
    },
  }
}

export function createReducer(initialState: any, reducerMap: any) {
  return (injectState: any = initialState) => {
    const injectedState = cloneDeep(Object.assign(initialState, injectState))
    return produce((state: any = injectedState, action: any) => {
      const { __values__: { scope } = {} as any } = state
      const { __values__: { scope: actionScope } = {} as any } = action
      const scopes = toArray(actionScope)
      if (scope && !scopes.includes(scope)) {
        return state
      }
      const reducer = reducerMap(state)[action.type]
      if (reducer) {
        return reducer(action)
      }
      return state
    })
  }
}

export function createPayloadAction(type: string) {
  return (payload: any) => ({ type, payload })
}
