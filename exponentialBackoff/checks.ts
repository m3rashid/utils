/**
 * @param ms milliseconds to wait
 * @returns Promise that resolves after ms milliseconds
 */
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * @param successProbability probability of success
 * @param result result to return if successful
 * @param error error to throw if unsuccessful
 * @returns Promise that resolves to result with probability successProbability
 */
const maybeFail = (successProbability: number, result: unknown, error: any) =>
  new Promise((res, rej) =>
    Math.random() < successProbability ? res(result) : rej()
  );

/**
 * @returns Promise that resolves to 'result' with probability 0.9
 */
const maybeFailingOperation = async () => {
  await wait(10);
  return maybeFail(0.1, 'result', 'error');
};

/**
 * @param fn function to call
 * @param depth number of retries
 * @returns new function that calls fn and retries up to depth times, with exponential backoff
 */
const callWithRetry = async (
  fn: (...params: any) => any,
  depth: number = 0
) => {
  try {
    return await fn();
  } catch (e) {
    if (depth > 7) {
      throw e;
    }
    await wait(2 ** depth * 10);

    return callWithRetry(fn, depth + 1);
  }
};

export const result1 = await callWithRetry(maybeFailingOperation);
console.log(result1);

/**
 * @param startProgress number that shows how much progress has been made
 * @returns Promise that resolves to an object with progress and result
 */
const progressingOperation = async (startProgress: number = 0) => {
  await wait(10);
  const progress =
    Math.round(Math.min(startProgress + Math.random() / 3, 1) * 10) / 10;
  return {
    progress,
    result: progress === 1 ? 'result' : undefined,
  };
};

/**
 * @param fn Function to call that returns an object with progress and result
 * @param status status of the operation
 * @param depth maximum number of retries
 * @returns
 */
const callWithProgress = async (
  fn: (
    ...params: any
  ) => Promise<{ progress: number; result: string | undefined }>,
  status?: any,
  depth: number = 0
) => {
  const result = await fn(status);
  if (result.progress === 1) return result.result;
  else {
    // Unfinished
    if (depth > 7) throw result;
    await wait(2 ** depth * 10);
    return callWithProgress(fn, result.progress, depth + 1);
  }
};

export const result2 = await callWithProgress(progressingOperation);
console.log(result2);
