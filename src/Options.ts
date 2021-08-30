type Options = {
  /** The commands folder for this project. */
  commandsDir: string;
  /** The test servers for the project. */
  testServers?: string | string[];
  /** The custom settings for this project. */
  customSettings?: {
    /** The customizable permission error.
     * @example
     * new Slashcord(client, {
     * commandsDir: "commands",
     * customSettings: {
     *  permissionError: "Stop, you need the {PERMISSION} permission."
     * }
     * })
     */
    permissionError?: string;
  };
};

export default Options;
