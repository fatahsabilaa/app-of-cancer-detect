const ClientError = require("../exception/clientError");

class InputError extends ClientError {
  constructor(message) {
    super(message);
    this.name = "InputError";
  }
}

module.exports = InputError;