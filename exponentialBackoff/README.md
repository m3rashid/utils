### Exponential Backoff

A backoff algorithm makes sure that when a target system can not serve a request it is not flooded with subsequent retries. It achieves this by introducing a waiting period between the retries to give the target a chance to recover. The need for a backoff builds on the observation that a service is unavailable when it is overloaded and sending more requests only exacerbates the problem. When all callers temporarily cease adding more load to the already overloaded service usually smooths the traffic spikes with only a slight delay.

The backoff algorithm used determines how much to wait between the retries. The best configuration is actively researched in the case of network congestion, such as when a mobile network is saturated. Retrying a failed call to a remote server is a much easier problem and doing it right does not require years of research.

### Exponential backoff

Let’s first revisit the problem of choosing the backoff strategy, i.e. how much to wait between the retries! Sending requests too soon puts more load on the potentially struggling server, while waiting too long introduces too much lag. The exponential backoff became the standard algorithm to use. It waits exponentially longer for subsequent retries, which makes the first few tries happen with only a slight delay while it reaches longer periods quickly.

It has two parameters: the delay of the first period and the growth factor. For example, when the first retry waits 10ms and the subsequent ones double the previous values, the waiting times are: 10, 20, 40, 80, 160, 320, 640, 1280, …

Notice that the sum of the first 3 attempts is less than 100 ms, which is barely noticeable. But it reaches >1 second in just 8 tries.
