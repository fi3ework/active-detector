# active-detector

![](https://img.shields.io/npm/v/active-detector)
![](https://img.shields.io/bundlephobia/minzip/active-detector)

## Install

```zsh
yarn add active-detector
```

## Usage

### Quick Start

```typescript
import { AD, USER_STATE, ActiveRange } from 'active-detector'
const ad = new AD()
ad.getState() // 'active'
ad.ActiveRange() // [start: 1572160131022, end: 1572160127925 ]
ad.on('active', console.log('turn to active'))
ad.on('inactive', console.log('turn to inactive'))
```

### add listener

active-detector use [tiny-emitter](https://github.com/scottcorgan/tiny-emitter#readme) as the callback controller.

```typescript
on: (action: USER_STATE, cb: Function) => void
off: (action: USER_STATE, cb: Function) => void
once: (action: USER_STATE, cb: Function) => void
```

### get current state

```typescript
getState: () => USER_STATE;
```

### get active ranges

```typescript
getRanges: () => ActiveRange[];
```