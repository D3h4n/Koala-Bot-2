import {handleCommand} from "../src/interactions";
import * as fc from 'fast-check';

describe("When receiving the echo command", () => {
  it("replies with the correct message", () => {
    const message = "Hello World"
    const replier = {
      reply: jest.fn()
    }

    // Act
    handleCommand("echo", {message}, replier)

    // Assert
    expect(replier.reply).toBeCalledWith(message)
  })

  it("always replies with the correct message", () => {
    fc.assert(fc.property(fc.string({minLength: 1}), (message) => {
      const replier = {
        reply: jest.fn()
      }

      // Act
      handleCommand("echo", {message}, replier)

      // Assert
      expect(replier.reply).toBeCalledWith(message)
    }))
  })
})

