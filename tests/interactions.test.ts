import {handleCommand} from "../src/interactions";

describe("When receiving a command", () => {
  it.each([
    {
      name: "Choose",
      options: {
        "option1": "Hello",
        "option2": "World"
      }
    },
    {
      name: "Play",
      options: {
        "song": "tylko jedno w głowie mam",
      }
    }
  ])("replies with hello world", ({ name, options }) => {
    const replier = {
      reply: jest.fn()
    }

    // Act
    handleCommand(name, options, replier)

    // Assert
    expect(replier.reply).toBeCalledWith("Hello, World");
  })
})
