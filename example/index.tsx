import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ActiveDetector from '../.'

const ad = new ActiveDetector({
  inactiveThresh: 2000,
})

const logTurnActive = () => {
  console.log('[state turn to active]')
}

const logTurnInactive = () => {
  console.log('[state turn to inactive]')
  console.log(ad.getRanges())
}

const logTick = state => {
  console.log('[tick]', state)
}

ad.on('active', logTurnActive)
ad.on('inactive', logTurnInactive)
ad.on('tick', logTick)

ReactDOM.render(<></>, document.getElementById('root'))
