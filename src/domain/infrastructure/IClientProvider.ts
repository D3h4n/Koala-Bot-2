import { Client } from 'discord.js'

export default interface IClientProvider {
  getClient: () => Client<boolean>
}
