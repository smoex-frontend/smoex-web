import * as React from 'react'
import { IS_QQ_WEBVIEW } from '@smoex-basic/browser'
import styles from './styles/App.module.scss'
import { transformStyles } from '@smoex-kit/react-dom'

const cx = transformStyles(styles)

export const Controller = () => {
  if (!IS_QQ_WEBVIEW) {
    return null
  }

  return (
    <div className={cx('controller')}>
      <div className={cx('controller-wrapper')}>
        <div
          className={cx('controller-btn')}
          onClick={() => window.history.back()}
        >
          {`<`}
        </div>
        <div
          className={cx('controller-btn')}
          onClick={() => window.history.forward()}
        >
          {`>`}
        </div>
      </div>
    </div>
  )
}

export default Controller
