import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { InfoBox } from "@/components/InfoBox";
import {
  HEAD_TITLE,
  APP_TITLE,
  APP_DESCRIPTION,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  HEAD_DESCRIPTION,
} from "@/resources/strings";
import SpotifyButton, { SpotifyButtonAction } from "@/components/SpotifyButton";

/**
 * The homepage for the application.
 * @returns {JSX.Element} the application homepage.
 */
export default function Home(): JSX.Element {
  // routes between pages in the site
  const router = useRouter();
  // state to determine if the page is ready to be rendered
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // if the user is already logged in, redirect to the logged in page
    if (
      localStorage.getItem(ACCESS_TOKEN_NAME) &&
      localStorage.getItem(REFRESH_TOKEN_NAME) &&
      localStorage.getItem("expires_at")
    ) {
      router.push("/loggedin");
    } else {
      setReady(true);
    }
  }, []);

  /**
   * The interface for the response from the Spotify API.
   * @property {string} url The URL to redirect the user to.
   */
  interface RedirectURL {
    url: string;
  }

  /**
   * Redirects the user to the Spotify login and authorization page.
   * @returns {void}
   */
  function login(): void {
    console.log("login");
    fetch("/api/spotify/verify")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json: RedirectURL) => {
        console.log(json);
        window.location.assign(json.url);
      });
  }

  return (
    <>
      {!ready ? (
        <></>
      ) : (
        <>
          <Head>
            <title>{HEAD_TITLE}</title>
            <meta name="description" content={HEAD_DESCRIPTION} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="container">
            <h1 className="header">{APP_TITLE}</h1>
            <p className="app-description">{APP_DESCRIPTION}</p>
            <SpotifyButton
              action={SpotifyButtonAction.Login}
              actionFunction={login}
            />
            <section className="info-section">
              <InfoBox
                imgsrc="img/music-note-white.png"
                content="Select the desired genre and duration of your CaDance."
              />
              <InfoBox
                imgsrc="img/running-shoe-white.png"
                content="CaDance creates a playlist based on your preferences and
                running cadence and queues songs accordingly."
              />
              <InfoBox
                imgsrc="img/save-icon-white.png"
                content="Save your Cadances for future reuse."
              />
            </section>
          </div>
        </>
      )}
    </>
  );
}
