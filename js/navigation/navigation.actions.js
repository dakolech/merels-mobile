const prefix = 'merels-';

export const JUMP_TO = `${prefix}JUMP_TO`;
export const PUSH_ROUTE = `${prefix}PUSH_ROUTE`;
export const POP_ROUTE = `${prefix}POP_ROUTE`;
export const RESET_ROUTE = `${prefix}RESET_ROUTE`;
export const REPLACE_AT = `${prefix}REPLACE_AT`;
export const REPLACE_AT_INDEX = `${prefix}REPLACE_AT_INDEX`;
export const JUMP_TO_INDEX = `${prefix}JUMP_TO_INDEX`;
export const NAVIGATE_TO = `${prefix}NAVIGATE_TO`;
export const BACK = `${prefix}BACK`;
export const FORWARD = `${prefix}FORWARD`;

export function navigateTo(payload) {
  return { payload, type: NAVIGATE_TO };
}

export function pushRoute(route, key) {
  if (!key) {
    throw new Error('pushRoute requires key argument');
  }

  return {
    type: PUSH_ROUTE,
    payload: {
      route,
      key,
    },
  };
}

export function popRoute(key) {
  if (!key) {
    throw new Error('popRoute requires key argument');
  }

  return {
    type: POP_ROUTE,
    payload: {
      key,
    },
  };
}

export function jumpToIndex(routeIndex, key) {
  if (!key) {
    throw new Error('Jump to Index requires key argument');
  }

  return {
    type: JUMP_TO_INDEX,
    payload: {
      routeIndex,
      key,
    },
  };
}

export function jumpTo(keyOrIndex, key) {
  // XX: to make this backwards compatible,
  // jumpTo supports both key and index first arg
  // JUMP_TO action is used if the first arg is a string key
  // otherwise JUMP_TO_INDEX is used

  if (!key) {
    throw new Error('jumpTo requires key argument');
  }

  if (typeof keyOrIndex === 'string') {
    return {
      type: JUMP_TO,
      payload: {
        routeKey: keyOrIndex,
        key,
      },
    };
  }

  return jumpToIndex(keyOrIndex, key);
}

export function reset(routes, key, index) {
  if (!key) {
    throw new Error('reset requires key argument');
  }
  return {
    type: RESET_ROUTE,
    payload: {
      routes,
      index,
      key,
    },
  };
}

export function replaceAt(routeKey, route, key) {
  if (!key) {
    throw new Error('Replace At requires key argument');
  }

  return {
    type: REPLACE_AT,
    payload: {
      routeKey,
      route,
      key,
    },
  };
}

export function replaceAtIndex(index, route, key) {
  if (!key) {
    throw new Error('Replace At Index requires key argument');
  }

  return {
    type: REPLACE_AT_INDEX,
    payload:
    {
      index,
      route,
      key,
    },
  };
}

export function back(key) {
  if (!key) {
    throw new Error('popRoute requires key argument');
  }

  return {
    type: BACK,
    payload: {
      key,
    },
  };
}

export function forward(key) {
  if (!key) {
    throw new Error('popRoute requires key argument');
  }

  return {
    type: FORWARD,
    payload: {
      key,
    },
  };
}
