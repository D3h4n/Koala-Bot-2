import {executeCommand} from "../src/interactions";
import * as fc from 'fast-check';

describe("When receiving the echo command", () => {
  it("replies with the correct message", () => {
    const message = "Hello World"
    const replier = {
      reply: jest.fn()
    }

    // Act
    executeCommand("echo", {message}, replier)

    // Assert
    expect(replier.reply).toBeCalledWith(message)
  })

  it("always replies with the correct message", () => {
    fc.assert(fc.property(fc.string({minLength: 1}), (message) => {
      const replier = {
        reply: jest.fn()
      }

      // Act
      executeCommand("echo", {message}, replier)

      // Assert
      expect(replier.reply).toBeCalledWith(message)
    }))
  })
})

describe("When receiving the choose command", () => {
  it.each([
      [["Hello World", "1234"]],
      [["Flight", "Invisibility", "Invincibility", "Super Genius"]]
  ])("replies with a valid choice", (choices) => {
    const replier = {
      reply: jest.fn()
    }

    const replies = choices.map((choice) => `\`${choice}\``)

    // Act
    const options = {}

    choices.forEach((choice, idx) => {
      options[`choice${idx + 1}`] = choice
    })

    executeCommand("choose", options, replier)

    // Assert
    expect(replies).toContain(replier.reply.mock.lastCall[0])
  })

  it("replies with a random choice from the given options", () => {
    fc.assert(fc.property(
        fc.array(fc.string({minLength: 1}), {minLength: 2, maxLength: 10}),
        fc.float({min: 0, max: 1}),
        (choices, randomValue) => {
          const replier = {
            reply: jest.fn()
          }

          // Arrange
          jest.spyOn(global.Math, 'random').mockReturnValue(randomValue)

          // Act
          const options = {}

          choices.forEach((choice, idx) => {
            options[`choice${idx + 1}`] = choice
          })

          executeCommand("choose", options, replier)

          // Assert
          const expectedIndex = Math.floor(randomValue * choices.length)
          expect(replier.reply).toBeCalledWith(`\`${choices[expectedIndex]}\``)
        }
    ))
  })
})
