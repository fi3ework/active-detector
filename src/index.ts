import { TinyEmitter } from 'tiny-emitter'

import { debounce } from './utils'

export type USER_STATE = 'active' | 'inactive'

const USER_EVENTS = [
  'click',
  'contextmenu',
  'dblclick',
  'mousemove',
  'scroll',
  'touchmove',
  'touchstart',
  'keypress',
  'keydown',
  'resize',
] as const

interface ActiveDetectorOptions {
  /**
   * in terms of performance, all users activations that be listened is debounced.
   * default debounce timeout is 800ms.
   */
  debounceTimeout: number
  /**
   * time of determined as the threshold of inactive.
   * default inactive thresh timeout is 30s.
   */
  inactiveThresh: number
}

export interface ActiveRange {
  start: number
  end: number
}

const DEFAULT_OPTIONS: ActiveDetectorOptions = {
  debounceTimeout: 900,
  inactiveThresh: 30000,
}

export default class ActiveDetector {
  private activeRanges: ActiveRange[] = []
  private currRange: ActiveRange | null = document.hidden ? null : { start: Date.now(), end: -1 }
  private state: USER_STATE = document.hidden ? 'inactive' : 'active'
  private timeoutId: number = -1
  private options: ActiveDetectorOptions = DEFAULT_OPTIONS
  public ee = new TinyEmitter()
  public constructor(options: Partial<ActiveDetectorOptions> = DEFAULT_OPTIONS) {
    this.overrideOptions(options)
    this.stateController('active')
    this.initListener()
    this.initListenVisibilityChange()
  }

  private overrideOptions = (options: Partial<ActiveDetectorOptions>) => {
    this.options.inactiveThresh = options.inactiveThresh || this.options.inactiveThresh
    this.options.debounceTimeout = options.debounceTimeout || this.options.debounceTimeout
  }

  private initListenVisibilityChange() {
    const handler = () => {
      this.stateController(document.hidden ? 'active' : 'inactive')
    }
    document.addEventListener('visibilitychange', handler)
  }

  private initListener() {
    const handler = debounce(() => this.stateController('active' as USER_STATE), this.options.debounceTimeout)
    USER_EVENTS.forEach(key => document.addEventListener(key, handler))
  }

  private toggleState(action: USER_STATE) {
    const { activeRanges, currRange } = this

    if (action === 'active') {
      this.currRange = { start: Date.now(), end: -1 }
    } else {
      if (currRange) {
        currRange.end = Date.now() - this.options.inactiveThresh
        activeRanges.push(currRange)
      }
    }

    this.ee.emit(action)
  }

  private stateController = (nextState: USER_STATE) => {
    const { state: prevState } = this

    // tap on active
    if (nextState === 'active') {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = window.setTimeout(() => {
        this.toggleState('inactive')
        this.state = 'inactive'
      }, this.options.inactiveThresh)
    }

    // active -> inactive
    if (prevState === 'active' && nextState === 'inactive') {
      this.toggleState('inactive')
    }

    // inactive -> active
    if (prevState === 'inactive' && nextState === 'active') {
      this.toggleState('active')
    }

    this.state = nextState
  }

  public getState = (): USER_STATE => {
    return this.state
  }

  public getRanges = (): ActiveRange[] => {
    return this.activeRanges
  }

  // wrap ee
  public on = (action: USER_STATE, cb: Function) => {
    this.ee.on(action, cb, this)
  }

  public once = (action: USER_STATE, cb: Function) => {
    this.ee.once(action, cb, this)
  }

  public off = (action: USER_STATE, cb: Function) => {
    this.ee.off(action, cb)
  }

  public clearRanges = () => {
    this.currRange = null
    this.activeRanges = []
  }
}
