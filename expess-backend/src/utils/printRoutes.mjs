// Middleware function to log all routes
export const listRoutes = (app) => {
  console.log('\nAvailable Routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      const methods = Object.keys(middleware.route.methods)
        .join(', ')
        .toUpperCase();
      console.log(`${methods} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Routes added via a router
      middleware.handle.stack.forEach((nestedMiddleware) => {
        if (nestedMiddleware.route) {
          const methods = Object.keys(nestedMiddleware.route.methods)
            .join(', ')
            .toUpperCase();
          console.log(`${methods} ${nestedMiddleware.route.path}`);
        }
      });
    }
  });
};
