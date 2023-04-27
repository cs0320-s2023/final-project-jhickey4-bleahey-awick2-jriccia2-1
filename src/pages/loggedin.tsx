import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { Metronome } from "../scripts/metronome";
import localFont from "next/font/local";
import Genre from "../components/Genre";
import { logout, exchangeToken } from "../api/spotify/testVerifier";
const variableFont = localFont({ src: "../../public/fonts/DS-Digital.woff2" });
import { useRouter } from "next/router";

export default function LoggedIn() {
  const [tempo, setTempo] = useState(100);
  const [metronome, setMetronome] = useState(new Metronome(tempo));
  const [metronomePlaying, setMetronomePlaying] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const router = useRouter();
  const { code } = router.query;
  console.log(code);


  //TODO: make code part of the state

  useEffect(() => {
    if (router.isReady) {
      console.log("here")
      if (code !== undefined) {
        console.log("got code")
        exchangeToken(code)
      } else if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("refresh_token") &&
        localStorage.getItem("expires_at")
      ) {

      } else {
        router.push("/");
      }

    }
  }, [code]);


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target) {
      console.log(event.target.value);
      if (!selectedGenres.includes(event.target.value)) {
        const copy = selectedGenres.slice();
        copy.push(event.target.value);
        setSelectedGenres(copy);
      }
    }
  };
  //TODO: get the user's name from the spotify api and display it here
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="header">CADANCE</h1>
      <div className="log-in-buttons">
        <button onClick={logout}>Log Out</button>
      </div>

      <div className="options">
        <button
          className="metronome-play-pause"
          onClick={() => {
            metronome.startStop();
            setMetronomePlaying(!metronomePlaying);
          }}
        >
          {metronomePlaying ? "Stop Metronome" : "Play Metronome"}
        </button>
        <div className="metronome_div">
          <button
            className="decreaseMetronome"
            onClick={() => {
              setTempo(tempo - 5);
              metronome.tempo = tempo - 5;
            }}
          >
            -
          </button>
          <div className="test">
            <div className="tempo">Tempo: {tempo}</div>
          </div>

          <button
            className="increaseMetronome"
            onClick={() => {
              setTempo(tempo + 5);
              metronome.tempo = tempo + 5;
            }}
          >
            +
          </button>
        </div>

        <div className="selectedOptions">
          {selectedGenres.map((val) => {
            return (
              <Genre
                genre={val}
                genres={selectedGenres}
                setGenre={setSelectedGenres}
              ></Genre>
            );
          })}
        </div>

        <select
          className="dropdown"
          name="genre"
          onChange={handleChange}
          defaultValue={"disabled"}
        >
          <option disabled value={"disabled"}>
            select desired genres
          </option>
          <option value="test1">test1</option>
          <option value="test2">test2</option>
        </select>
      </div>
    </>
  );
}
