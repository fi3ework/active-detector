# active-detector

Detect whether browser user's active state.

![](https://img.shields.io/npm/v/active-detector)
![](https://img.shields.io/bundlephobia/minzip/active-detector)

## Install

```zsh
yarn add active-detector
```

## Example

See demo [here](./example).
Run `yarn && yarn start` and watch the console log.

## Usage

### Quick Start

```typescript
import { AD, USER_STATE, ActiveRange } from 'active-detector'
const ad = new AD({
  inactiveThresh: 5000 // time of determined as the threshold of inactive, default is 30000ms
})
ad.getState() // 'active'
ad.ActiveRange() // [start: 1572160131022, end: 1572160127925 ]
ad.on('active', console.log('turn to active'))
ad.on('inactive', console.log('turn to inactive'))
```

### Options

Configuration of active-detector.

```typescript
constructor(options?: Partial<ActiveDetectorOptions>);
```

### Add Listener

The callbacks will be invoked when user from inactive to active, or from active to inactive.

active-detector use [tiny-emitter](https://github.com/scottcorgan/tiny-emitter#readme) as the callback controller.

```typescript
on: (action: USER_STATE, cb: Function) => void
off: (action: USER_STATE, cb: Function) => void
once: (action: USER_STATE, cb: Function) => void
```

### Get Current State

Get current user state.

```typescript
getState: () => USER_STATE;
```

### Get Active Time Ranges

Get current active time ranges. The start/end time is an Unix timestamp.

```typescript
getRanges: () => ActiveRange[]; // {start: number, end: number}[]
```

### Clear Time Ranges

Clear time ranges immediately, it might be used in case you have reported number of ranges by time.

```typescript
clearRanges: () => void; // {start: number, end: number}[]
```