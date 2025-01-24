'use strict';
module.exports = {
  generateServerResponse: (res, responseParams, responseElement) => {
    var { code, message } = responseParams;
    if (code === 200) {
      return res.status(200).send(responseElement);
    }
    return res.status(code).send(message);
  }
}
