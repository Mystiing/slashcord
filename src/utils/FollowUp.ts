import { Client } from "discord.js";
import Slashcord from "../Index";
import Interaction from "./Interaction";

class FollowUp {
  constructor(interaction: Interaction, client: Client, handler: Slashcord) {}
  send() {}
  edit() {}
  delete() {}
}

export default FollowUp;
