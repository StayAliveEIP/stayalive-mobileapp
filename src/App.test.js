import React from "react";
import { render } from "@testing-library/react-native";
import App from "./App";

describe("App Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<App />);
    const textElement = getByText("Main page !");
    expect(textElement).toBeTruthy();
  });
});
