export default class SlashError extends Error {
  constructor(message: any) {
    super();
    (this.name = "SlashError"), (this.message = message);
  }
}
