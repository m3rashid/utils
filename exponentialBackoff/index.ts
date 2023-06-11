/**
 *
 * @param func Function to be retried over and over again (until it succeeds)
 * 		- The function should return a promise
 * 		- If the promise is rejected, it will be retried
 * 		- It must be idempotent
 * 		- The function must not be handling the error internally. It must throw the error
 *
 * @param firstRetryAfterMs Time after the first retry (default: 500ms)
 * @param maxRetries Maximum number of retries (default: 3)
 * @param retryBackoff Backoff factor, this is the multiplier for the time between retries (default: 200ms)
 */
export const exponentialBackoffWithRetries = (
  func: <T = unknown>(...params: any) => Promise<T>,
  firstRetryAfterMs: number = 500,
  maxRetries: number = 3,
  retryBackoff: number = 200
) => {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const retry = () => {
      func()
        .then(resolve)
        .catch((err) => {
          if (retries < maxRetries) {
            retries++;
            setTimeout(retry, firstRetryAfterMs + retryBackoff * retries);
          } else reject(err);
        });
    };

    retry();
  });
};
