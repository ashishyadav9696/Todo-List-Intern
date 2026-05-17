const pc = require('picocolors');

const customLogger = (req, res, next) => {
  const start = Date.now();
  
  // Wait for the response to finish before logging
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    // Define colors for status codes
    let statusColor = pc.green;
    if (statusCode >= 500) {
      statusColor = pc.red;
    } else if (statusCode >= 400) {
      statusColor = pc.yellow;
    } else if (statusCode >= 300) {
      statusColor = pc.cyan;
    }

    // Define colors for HTTP methods
    let methodColor = pc.blue;
    if (method === 'POST') methodColor = pc.green;
    if (method === 'PUT' || method === 'PATCH') methodColor = pc.yellow;
    if (method === 'DELETE') methodColor = pc.red;

    console.log(
      `${pc.gray(`[${new Date().toISOString()}]`)} ` +
      `${methodColor(method.padEnd(7))} ` +
      `${pc.white(originalUrl)} ` +
      `${statusColor(statusCode)} ` +
      `${pc.gray(`${duration}ms`)} - IP: ${pc.gray(ip)}`
    );
  });

  next();
};

module.exports = customLogger;
