import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import LoggedIn from "@/pages/loggedin";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("LoggedIn", () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn().mockResolvedValue(Promise.resolve());
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    localStorage.clear();
  });

  it("renders app title", () => {
    render(<LoggedIn />);
    expect(screen.getByText("CaDance")).toBeInTheDocument();
  });
});
