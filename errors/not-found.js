class NotFoundErr extends Error {
  constructor(message) {
    super(message);
    this.name = 'Page Not Found';
    this.statusCode = 404;
  }
}

module.exports = NotFoundErr;
