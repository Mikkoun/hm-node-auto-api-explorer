const FailureMessageResponse = require('hmkit/lib/Responses/FailureMessageResponse').default;

module.exports = (err, req, res, next) => {
  /**
   * HTTP errors
   */
  if (err && err.response && err.response.status && err.response.body) {
    switch (err.response.status) {
      case 408:
        return buildErrorResponse(res, 'Vehicle asleep');
      case 403:
        return buildErrorResponse(res, 'Invalid authorization header');
    }
  }

  /**
   * Node SDK errors
   */
  if (err && err instanceof FailureMessageResponse && err.reason) {
    switch (err.reason.key) {
      case 0:
        return buildErrorResponse(res, 'Vehicle has not the capability to perform the command');
      case 1:
        return buildErrorResponse(res, 'User has not been authenticated or lacks permissions');
      case 2:
        return buildErrorResponse(res, 'Command can not be executed in the current car state');
      case 3:
        return buildErrorResponse(res, 'Command failed to execute in time for an unknown reason');
      case 4:
        return buildErrorResponse(res, 'Vehicle asleep');
      case 5:
        return buildErrorResponse(res, 'Invalid command');
    }
  }

  return buildErrorResponse(res, 'Unknown error, check your logs');
};

function buildErrorResponse(res, message) {
  return res.render('pages/error.ejs', { err: { message } });
}
