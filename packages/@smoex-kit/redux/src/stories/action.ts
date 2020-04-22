
import { TEST_ACTION, TEST_ASYNC_ACTION } from './enums'
import { createPayloadAction } from '../modules/creator'
import { testSlice } from '.'
import { testSelector } from './selectors'
import { memoryCache } from '../modules/cache'

const sleep = (timeountMS: any) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeountMS)
  })

const getName = async ({ count, keyword }: any = {}) => {
    await sleep(1000)
    if (keyword === '1') {
        throw new Error('keyword === 1')
    }
    return 'GetNameSuccess' + count
}

const getDetail = async ({ name }: any = {}) => {
    await sleep(500)
    return 'GetDetailSuccess:' + name
}

export const testAction = {
    setName: createPayloadAction(TEST_ACTION.SET_NAME),
    setDetail: createPayloadAction(TEST_ACTION.SET_DETAIL),
}

export const testAsyncAction = {
    getName: (count: any, keyword: any) => ({
        type: TEST_ASYNC_ACTION.GET_NAME,
        meta: { count, keyword },
        target: getName,
        success: testAction.setName,
        failure: TEST_ACTION.SET_ERROR,
    }),
    getDetail: () => ({
        type: TEST_ASYNC_ACTION.GET_DETAIL,
        target: getDetail,
        selector: {
            name: testSlice.selector(testSelector.testName),
        },
        meta: ({ name }: any) => ({ name }),
        failure: TEST_ACTION.SET_ERROR,
        success: testAction.setDetail,
    }),
    getDetailByCache: (keyword: any) => ({
        type: TEST_ASYNC_ACTION.GET_DETAIL,
        target: getDetail,
        selector: {
            name: testSlice.selector(testSelector.testName),
        },
        meta: ({ name }: any) => ({ name }),
        cache: ({ meta }: any) => memoryCache(meta),
        failure: TEST_ACTION.SET_ERROR,
        success: testAction.setDetail,
    }),
}
