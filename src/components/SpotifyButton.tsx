import { NextRouter } from "next/router";

/**
 * Represents the action that the SpotifyButton will take when clicked.
 */
export enum SpotifyButtonAction {
  /**
   * Represents the action to login to Spotify.
   */
  Login = "Login with Spotify",

  /**
   * Represents the action to logout of Spotify.
   */
  Logout = "Logout of Spotify",
}

/**
 * The props for the SpotifyButton component.
 * @property {SpotifyButtonAction} action The action that the SpotifyButton will take when clicked.
 * @property {() => void} actionFunction The function that will be called when the SpotifyButton is clicked.
 */
interface SpotifyButtonProps {
  action: SpotifyButtonAction;
  actionFunction: () => void;
}

/**
 * A component that allows the user to login to Spotify.
 * @param {SpotifyButtonProps} props The props for the SpotifyButton.
 * @returns {JSX.Element} A SpotifyButton component.
 */
export default function SpotifyButton(props: SpotifyButtonProps): JSX.Element {
  return (
    <button className="spotify-button hvr-grow" onClick={props.actionFunction}>
      {props.action}
    </button>
  );
}
