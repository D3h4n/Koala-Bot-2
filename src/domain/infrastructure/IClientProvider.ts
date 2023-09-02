import { Client } from 'discord.js'

export default interface IClientProvider {
  client: Client<boolean>
}
