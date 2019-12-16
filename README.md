# active-detector

Detect whether browser user is still active.

![](https://img.shields.io/npm/v/active-detector)
![](https://img.shields.io/bundlephobia/minzip/active-detector)

## Install

```zsh
yarn add active-detector
```

## Example

Demo [here](./example). Excute `yarn && yarn start` and watch the log in console.

## Usage

### Quick Start

```typescript
import { AD, USER_STATE, ActiveRange } from 'active-detector'
const ad = new AD()
ad.getState() // 'active'
ad.ActiveRange() // [start: 1572160131022, end: 1572160127925 ]
ad.on('active', () => console.log('turn to active')) // excute when user turn to be active
ad.on('inactive', () => console.log('turn to inactive')) // excute when user turn to be inactive
ad.on('tick', (state) => console.log(`tick tick, user is ${state} now.`)) // tick users's state
```

### Options

Configuration of active-detector.

```typescript
const ad = new ActiveDetector({
  inactiveThresh: 10000, // optional, time of determined as the threshold of inactive, default is 30000ms
  throttleTimeout: 500, // optional, in terms of performance, all users activations that be listened is throttled, default is 900ms
})
```

### Add Listener

The callbacks will be invoked when user from inactive to active, or from active to inactive.

active-detector use [tiny-emitter](https://github.com/scottcorgan/tiny-emitter#readme) as the callback controller.

```typescript
on: (action: LISTENABLE_ACTION, cb: (ActiveRange[])=> any) => void
off: (action: LISTENABLE_ACTION, cb: (ActiveRange[])=> any) => void
once: (action: LISTENABLE_ACTION, cb: (ActiveRange[])=> any) => void

type LISTENABLE_ACTION =
| 'active' // invoked when user turn to be active from inactive
| 'inactive' // invoked when user turn to be inactive from active
| 'tick' // // tick users's state every ${inactiveThresh} inverval
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
