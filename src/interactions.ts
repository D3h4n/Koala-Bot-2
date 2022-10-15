interface MessageReplier {
  reply: (string) => void
}

export function handleCommand(
    _name: string, _options: Record<string, string | undefined>, replier: MessageReplier
) {
  replier.reply("Hello, World");
}
