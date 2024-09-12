import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import Home from "@/pages/index";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Home", () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn().mockResolvedValue(Promise.resolve());
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    localStorage.clear();
  });

  test("renders app title and description", () => {
    render(<Home />);
    expect(screen.getByText("CaDance")).toBeInTheDocument();
    expect(
      screen.getByText("A fine tuned running and listening experience")
    ).toBeInTheDocument();
  });

  test("renders login button", () => {
    render(<Home />);
    expect(screen.getByText("Login with Spotify")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Login with Spotify");
    expect(screen.getByText("Login with Spotify")).toHaveClass(
      "spotify-button"
    );
    expect(screen.getByText("Login with Spotify")).toBeEnabled();
  });

  test("renders info box", () => {
    render(<Home />);
    expect(
      screen.getByText("Select the desired genre and duration of your CaDance.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "CaDance creates a playlist based on your preferences and running cadence and queues songs accordingly."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Save your Cadances for future reuse.")
    ).toBeInTheDocument();
  });

  test("navigates to loggedin page when tokens are available", async () => {
    localStorage.setItem("access_token", "access_token");
    localStorage.setItem("refresh_token", "refresh_token");
    localStorage.setItem("expires_at", "expiry_time");

    render(<Home />);

    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenCalledWith("/loggedin")
    );
  });

  test("does not navigate to loggedin page when tokens are not available", async () => {
    render(<Home />);
    await waitFor(() => expect(mockRouterPush).not.toHaveBeenCalled());
  });
});
