import type { int } from "@tsonic/core/types.js";
import {
  CancellationTokenSource,
  Monitor,
} from "@tsonic/dotnet/System.Threading.js";
import { Task } from "@tsonic/dotnet/System.Threading.Tasks.js";
import { Map } from "./map-object.js";

class TimerRegistrySyncRoot {}

const timeoutHandles = new Map<int, CancellationTokenSource>();
const intervalHandles = new Map<int, CancellationTokenSource>();
const timerRegistrySync = new TimerRegistrySyncRoot();
let nextTimerId = 1 as int;
type TimerValue = string | number | boolean | object | null;

const normalizeDelay = (value?: int): int => {
  if (value === undefined || value <= 0) {
    return 0 as int;
  }
  return value;
};

const registerTimer = (
  registry: Map<int, CancellationTokenSource>,
  cancellation: CancellationTokenSource
): int => {
  Monitor.Enter(timerRegistrySync);
  try {
    const id = nextTimerId;
    nextTimerId = (nextTimerId + (1 as int)) as int;
    registry.set(id, cancellation);
    return id;
  } finally {
    Monitor.Exit(timerRegistrySync);
  }
};

const disposeTimer = (
  registry: Map<int, CancellationTokenSource>,
  id: int
): CancellationTokenSource | undefined => {
  let handle: CancellationTokenSource | undefined = undefined;

  Monitor.Enter(timerRegistrySync);
  try {
    handle = registry.get(id);
    if (handle === undefined) {
      return undefined;
    }

    registry.delete(id);
  } finally {
    Monitor.Exit(timerRegistrySync);
  }

  if (handle === undefined) {
    return undefined;
  }

  handle.Cancel();
  handle.Dispose();
  return handle;
};

const completeTimer = (
  registry: Map<int, CancellationTokenSource>,
  id: int,
  cancellation: CancellationTokenSource
): void => {
  let shouldDispose = false;

  Monitor.Enter(timerRegistrySync);
  try {
    const registered = registry.get(id);
    if (registered === cancellation) {
      registry.delete(id);
      shouldDispose = true;
    }
  } finally {
    Monitor.Exit(timerRegistrySync);
  }

  if (shouldDispose) {
    cancellation.Dispose();
  }
};

export const setTimeout = (
  handler: (...args: TimerValue[]) => void,
  timeout?: int,
  ...args: TimerValue[]
): int => {
  const cancellation = new CancellationTokenSource();
  const id = registerTimer(timeoutHandles, cancellation);

  void Task.Run(async () => {
    try {
      await Task.Delay(normalizeDelay(timeout), cancellation.Token);
      if (!cancellation.IsCancellationRequested) {
        handler(...args);
      }
    } catch {
      return;
    } finally {
      completeTimer(timeoutHandles, id, cancellation);
    }
  });

  return id;
};

export const clearTimeout = (id: int): void => {
  void disposeTimer(timeoutHandles, id);
};

export const setInterval = (
  handler: (...args: TimerValue[]) => void,
  timeout?: int,
  ...args: TimerValue[]
): int => {
  const cancellation = new CancellationTokenSource();
  const delay = normalizeDelay(timeout);
  const id = registerTimer(intervalHandles, cancellation);

  void Task.Run(async () => {
    try {
      while (!cancellation.IsCancellationRequested) {
        await Task.Delay(delay, cancellation.Token);
        if (cancellation.IsCancellationRequested) {
          break;
        }
        handler(...args);
      }
    } catch {
      return;
    } finally {
      completeTimer(intervalHandles, id, cancellation);
    }
  });

  return id;
};

export const clearInterval = (id: int): void => {
  void disposeTimer(intervalHandles, id);
};
