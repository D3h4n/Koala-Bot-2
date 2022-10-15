import {returnInput} from "./index";

describe("This is a test suite", () => {
  it.each([15, "hello", true])
  ("This is a test", (value) => {
    expect(returnInput(value)).toEqual(value);
  })
})
