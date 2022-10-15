import { returnInput } from "./index";

describe("This is a test suite", () => {
  it("This is a test", () => {
    const value = 15;
    expect(returnInput(value)).toEqual(value);
  })
})
