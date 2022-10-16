import {handleCommand} from "../src/interactions";

describe("When receiving the echo command", () => {
  it.each([
    "Hello World", "Dance",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
  ])("replies with the correct message", (message) => {
    const replier = {
      reply: jest.fn()
    }

    // Act
    handleCommand("echo", {message}, replier)

    // Assert
    expect(replier.reply).toBeCalledWith(message)
  })
})

