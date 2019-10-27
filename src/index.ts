type USER_STATE = 'active' | 'inactive'

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
// TODO: other devices

interface IActiveDetectorOptions {
  inactiveThresh: number
}

interface IActiveRange {
  start: number
  end: number
}

const DEFAULT_OPTIONS: IActiveDetectorOptions = {
  inactiveThresh: 5000,
}

export default class ActiveDetector {
  private activeRanges: IActiveRange[] = []
  private currRange: IActiveRange = { start: Date.now(), end: -1 }
  private state: USER_STATE = 'active'
  private timeoutId: number = -1
  private options: IActiveDetectorOptions = DEFAULT_OPTIONS
  private constructor(options: Partial<IActiveDetectorOptions> = DEFAULT_OPTIONS) {
    this.overrideOptions(options)
    this.initListener()
    this.initListenVisibilityChange()
  }

  private overrideOptions = (options: Partial<IActiveDetectorOptions>) => {
    this.options.inactiveThresh = options.inactiveThresh || this.options.inactiveThresh
  }

  private initListenVisibilityChange() {
    const handler = () => {
      this.stateController(document.hidden ? 'active' : 'inactive')
    }
    document.addEventListener('visibilitychange', handler)
  }

  private initListener() {
    const handler = () => this.stateController('active' as USER_STATE)
    USER_EVENTS.forEach(key => document.addEventListener(key, handler))
  }

  private kickNextRange() {
    const { activeRanges, currRange } = this
    currRange.end = Date.now()
    activeRanges.push(currRange)
    this.currRange = { start: Date.now(), end: -1 }
  }

  private stateController = (nextState: USER_STATE) => {
    const { currRange } = this
    const prevActiveStamp = currRange.start
    const currActiveStamp = Date.now()

    if (nextState === 'active') {
      window.clearTimeout(this.timeoutId)
    }

    // re-active after idle
    if (currActiveStamp - prevActiveStamp >= this.options.inactiveThresh) {
      this.kickNextRange()
      this.state = 'active'
    }

    // timeout to set inactive
    this.timeoutId = window.setTimeout(() => {
      this.state = 'inactive'
    }, this.options.inactiveThresh)

    this.state = nextState
  }

  public getState = (): USER_STATE => {
    return this.state
  }
}
