import { Client } from "discord.js";
import Slashcord from "../Index";
import Interaction from "./Interaction";
declare class FollowUp {
    constructor(interaction: Interaction, client: Client, handler: Slashcord);
    send(): void;
    edit(): void;
    delete(): void;
}
export default FollowUp;
