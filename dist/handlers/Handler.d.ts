import Slashcord from "../Index";
declare class Handler {
    constructor(handler: Slashcord, dir: string);
    makeSlash(file: string, fileName: string, handler: Slashcord): Promise<void>;
}
export { Handler };
