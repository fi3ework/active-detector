import { TinyEmitter } from 'tiny-emitter'

import { throttle } from './utils'

export type USER_STATE = 'active' | 'inactive'
export type ACTIVE_TICK = 'tick'
export type LISTENABLE_ACTION = USER_STATE | USER_STATE

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
   * in terms of performance, all users activations that be listened is throttled.
   * default throttle timeout is 800ms.
   */
  throttleTimeout: number
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
  throttleTimeout: 900,
  inactiveThresh: 30000,
}

export default class ActiveDetector {
  private activeRanges: ActiveRange[] = []
  private currRange: ActiveRange | null = document.hidden ? null : { start: Date.now(), end: -1 }
  private state: USER_STATE = document.hidden ? 'inactive' : 'active'
  private latestActiveTime: number = Date.now()
  private options: ActiveDetectorOptions = DEFAULT_OPTIONS
  public ee = new TinyEmitter()
  public constructor(options: Partial<ActiveDetectorOptions> = DEFAULT_OPTIONS) {
    this.overrideOptions(options)
    this.initListener()
    this.initListenVisibilityChange()
  }

  private overrideOptions = (options: Partial<ActiveDetectorOptions>) => {
    this.options.inactiveThresh = options.inactiveThresh || this.options.inactiveThresh
    this.options.throttleTimeout = options.throttleTimeout || this.options.throttleTimeout
  }

  private initListenVisibilityChange() {
    const handler = () => {
      this.toggleState(document.hidden ? 'active' : 'inactive')
    }
    document.addEventListener('visibilitychange', handler)
  }

  private initListener() {
    window.setInterval(() => {
      const currTime = Date.now()
      const meetIdleTime = currTime - this.latestActiveTime > this.options.inactiveThresh
      if (meetIdleTime && this.state === 'active') {
        this.toggleState('inactive')
      }
      this.ee.emit('tick', this.state)
    }, this.options.inactiveThresh)
    const handler = throttle(this.activeHandler, this.options.throttleTimeout)
    USER_EVENTS.forEach(key => document.addEventListener(key, handler))
  }

  private activeHandler = () => {
    this.latestActiveTime = Date.now()
    const prevState = this.state
    if (prevState === 'inactive') {
      this.toggleState('active')
    }
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

    this.state = action
    this.ee.emit(action)
  }

  public getState = (): USER_STATE => {
    return this.state
  }

  public getRanges = (): ActiveRange[] => {
    return this.activeRanges
  }

  // wrap ee
  public on = (action: LISTENABLE_ACTION, cb: Function) => {
    this.ee.on(action, cb, this)
  }

  public once = (action: LISTENABLE_ACTION, cb: Function) => {
    this.ee.once(action, cb, this)
  }

  public off = (action: LISTENABLE_ACTION, cb: Function) => {
    this.ee.off(action, cb)
  }

  public clearRanges = () => {
    this.currRange = null
    this.activeRanges = []
  }
}
