import type { int } from "@tsonic/core/types.js";
import { CancellationTokenSource } from "@tsonic/dotnet/System.Threading.js";
import { Task } from "@tsonic/dotnet/System.Threading.Tasks.js";
import { Map } from "./map-object.js";

const timeoutHandles = new Map<int, CancellationTokenSource>();
const intervalHandles = new Map<int, CancellationTokenSource>();
let nextTimerId = 1 as int;
type TimerValue = string | number | boolean | object | null;

const normalizeDelay = (value?: int): int => {
  if (value === undefined || value <= 0) {
    return 0 as int;
  }
  return value;
};

const allocateTimerId = (): int => {
  const id = nextTimerId;
  nextTimerId = (nextTimerId + (1 as int)) as int;
  return id;
};

const disposeTimer = (
  registry: Map<int, CancellationTokenSource>,
  id: int
): CancellationTokenSource | undefined => {
  const handle = registry.get(id);
  if (handle === undefined) {
    return undefined;
  }
  registry.delete(id);
  handle.Cancel();
  handle.Dispose();
  return handle;
};

export const setTimeout = (
  handler: (...args: TimerValue[]) => void,
  timeout?: int,
  ...args: TimerValue[]
): int => {
  const id = allocateTimerId();
  const cancellation = new CancellationTokenSource();
  timeoutHandles.set(id, cancellation);

  void Task.Run(async () => {
    try {
      await Task.Delay(normalizeDelay(timeout), cancellation.Token);
      if (!cancellation.IsCancellationRequested) {
        handler(...args);
      }
    } catch {
      return;
    } finally {
      const registered = timeoutHandles.get(id);
      if (registered === cancellation) {
        timeoutHandles.delete(id);
        cancellation.Dispose();
      }
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
  const id = allocateTimerId();
  const cancellation = new CancellationTokenSource();
  const delay = normalizeDelay(timeout);
  intervalHandles.set(id, cancellation);

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
      const registered = intervalHandles.get(id);
      if (registered === cancellation) {
        intervalHandles.delete(id);
        cancellation.Dispose();
      }
    }
  });

  return id;
};

export const clearInterval = (id: int): void => {
  void disposeTimer(intervalHandles, id);
};
