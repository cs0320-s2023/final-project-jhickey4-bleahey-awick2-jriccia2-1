import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { Metronome } from "../scripts/metronome";
import localFont from "next/font/local";
import Genre from "../components/Genre";
const variableFont = localFont({ src: "../../public/fonts/DS-Digital.woff2" });
import { useRouter } from "next/router";
import { testButton } from "@/pages/api/spotify/playlistBuilder";
import { MetronomeComponent } from "@/components/MetronomeComponent";

export default function LoggedIn() {
  const [tempo, setTempo] = useState(100);
  const [metronome, setMetronome] = useState(new Metronome(tempo));
  const [metronomePlaying, setMetronomePlaying] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [numSongs, setNumSongs] = useState<number>(0);
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const { code, state } = router.query;

  //TODO: make code part of the state

  type data = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  };

  useEffect(() => {
    if (router.isReady) {
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("refresh_token");
      const expires_at = localStorage.getItem("expires_at");
      if (code !== undefined && state !== undefined) {
        fetch("/api/spotify/exchange?code=" + code + "&state=" + state)
          .then((res) => res.json())
          .then((json: data) => {
            console.log(json);
            const t = new Date();
            t.setSeconds(t.getSeconds() + json.expires_in);
            localStorage.setItem("access_token", json.access_token);
            localStorage.setItem("refresh_token", json.refresh_token);
            localStorage.setItem("expires_at", t.toString());
            window.history.replaceState({}, document.title, "/loggedin");
          });
        setReady(true);
      } else if (access_token && refresh_token && expires_at) {
        if (new Date(expires_at).valueOf() - new Date().valueOf() <= 0) {
          fetch(
            "/api/spotify/refresh?refresh_token=" +
              localStorage.getItem("refresh_token")
          )
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
              const t = new Date();
              t.setSeconds(t.getSeconds() + json.expires_in);
              localStorage.setItem("access_token", json.access_token);
              localStorage.setItem("expires_at", t.toString());
            });
        }
        setReady(true);
      } else {
        router.push("/").then(() => setReady(true));
      }
    }
  }, [code]);

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedGenres.includes(event.target.value)) {
      const copy = selectedGenres.slice();
      copy.push(event.target.value);
      setSelectedGenres(copy);
    }
  };
  const handleNumChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(event.target.value);
    setNumSongs(num);
  };

  const handleClick = () => {
    if (selectedGenres.length > 0 && numSongs > 0) {
      const url =
        "/api/spotify/songs?bpm=" +
        tempo +
        "&genres=" +
        selectedGenres +
        "&numsongs=" +
        numSongs +
        "&access_token=" +
        localStorage.getItem("access_token");
      console.log(url);
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
        });
    }
  };

  const logout = () => {
    //TODO: make sure any environment variables associated with the user are cleared
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  const testButton = () => {
    console.log(new Date().getUTCSeconds());
  };

  //TODO: get the user's name from the spotify api and display it here
  return (
    <>
      {!ready ? (
        <></>
      ) : (
        <>
          <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="outer">
            <div className="inner">
              <h1 className="header">CADANCE</h1>
              <div className="log-in-buttons">
                <button className="spotify-button" onClick={logout}>
                  Log Out
                </button>
                <button className="" onClick={testButton}>
                  TEST
                </button>
              </div>

              <h3 className="switch-title">Metronome ON/OFF</h3>
              <div className="metronome-switch-div">
                <label className="switch">
                  <input
                    onChange={() => {
                      metronome.startStop();
                      setMetronomePlaying(!metronomePlaying);
                    }}
                    aria-label="metronome switch"
                    type="checkbox"
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <MetronomeComponent
                tempo={tempo}
                setTempo={setTempo}
                metronome={metronome}
                max={300}
                min={50}
              ></MetronomeComponent>

              <div className="selectedOptions">
                {selectedGenres.length === 0 ? (
                  <>
                    <br></br>
                    <br></br>
                    <br></br>
                  </>
                ) : (
                  selectedGenres.map((val, i) => {
                    return (
                      <Genre
                        key={i}
                        genre={val}
                        genres={selectedGenres}
                        setGenre={setSelectedGenres}
                      ></Genre>
                    );
                  })
                )}
              </div>

              <div className="dropdown-div">
                <select
                  name="genre"
                  value={
                    selectedGenres.length === 0
                      ? "disabled"
                      : selectedGenres[selectedGenres.length - 1]
                  }
                  onChange={handleGenreChange}
                  className="dropdown hvr-grow"
                >
                  <option disabled value={"disabled"}>
                    Select desired genres
                  </option>
                  <option value="test1">test1</option>
                  <option value="test2">test2</option>
                  <option value="test3">test3</option>
                  <option value="test4">test4</option>
                  <option value="hip-hop">hip-hop</option>
                </select>

                <select
                  name="num-songs"
                  onChange={handleNumChange}
                  defaultValue={"disabled"}
                  className="dropdown hvr-grow"
                >
                  <option disabled value={"disabled"}>
                    Select desired number of songs
                  </option>
                  {[...Array(10)].map((x, i) => {
                    return (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="search-button-div">
                <button
                  className="search-button hvr-grow"
                  onClick={handleClick}
                >
                  FIND SONGS
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
