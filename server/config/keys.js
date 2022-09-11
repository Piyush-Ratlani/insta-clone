if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}

// token = {
//   modi:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMzYzc2NWNkOWUyMjA0NTQ1NTI3MzMiLCJpYXQiOjE2MTQyNzMzNjR9.gDrbOy4HEp9Z73orh_REeqdA25iSklAG9ZLL02kc8yI',
//   piyush:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDM3ZjNlNTc4MDQ3YjJiODhhNDBlNWQiLCJpYXQiOjE2MTQyODAxNjB9.OfVFPLIXf8YZhPoD5RaPMR6iKi69OhPNk5oSvHEskWU',
// };
