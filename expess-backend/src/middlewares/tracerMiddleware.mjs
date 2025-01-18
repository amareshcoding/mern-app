import tracer from '../config/tracer.js';

// Request count
let requestCount = 0;
// Interval to reset request count
let interval = 60000; // Reset every 60 seconds

// Reset request count every minute
setInterval(() => {
  requestCount = 0; // Reset request count every minute
}, interval);

export const tracerMiddleware = (req, res, next) => {
  requestCount++;

  // Log to terminal if request count exceeds threshold
  if (requestCount > 100) {
    console.warn(
      `High request volume detected! Request count: ${requestCount}`
    );
    // Log to Datadog
    tracer.trace('high_request_volume', (span) => {
      span.setTag('request_count', requestCount);
      span.finish(); // Finish the span
    });
  }

  next();
};
