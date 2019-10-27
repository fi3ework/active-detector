import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ActiveDetector from '../.'

const ad = new ActiveDetector()

const logActive = () => {
  console.log('[state: active]')
}

const logInactive = () => {
  console.log('[state: inactive]')
  console.log(ad.getRanges())
}

ad.on('active', logActive)
ad.on('inactive', logInactive)

ReactDOM.render(<></>, document.getElementById('root'))
