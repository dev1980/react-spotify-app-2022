import axios from "axios";
import { useEffect, useState } from "react";
import './App.css'
export const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "52446a192d7c42b998db802c83e0caf1";
const redirectUri = "http://localhost:3000";
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

function App() {
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    let _token = hash.access_token;
    if (_token) {
      setToken(_token);
    }
  });

  const searchHandler = async (e) => {
    //when the submit button is clicked this task (function is executed)
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchQuery,
        type: "track",
      },
    });
    setSongs(data.tracks.items); //setting the results of the api response to the search query
  };

  useEffect(() => console.log(songs), [songs]);

  const durationInMs = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="App">
      <div className="login" > 
      {!token && (
        <a
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`}
        >
          <button style={{height:"30px",width:"100px",display:"flex",justifyContent:"center",marginTop:"10px",alignItems:'center'}} >User Login</button>
        </a>
      )}
      </div>
      {
        token && (
          <>
          <div className="header" >
        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" alt="logo" />
      <form onSubmit={searchHandler}>
        <input
          type="text"
          placeholder="Search for any tracks.."
          style={{ padding: "6px 20px" }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      </div>
      {songs.map((e) => {
        // set a loop to run each song section information being generated from the api call.
        return (
          <div
            key={e.id}
            style={{
              padding: "0 12px",
              border: "1px solid black",
              backgroundColor: "gray",
              color: "black",
              display: "flex",
              flexDirection: "column",
              
            }}
          >
            <a href={e.external_urls.spotify} target="_blank">
              <h2 style={{ margin: "6px 2px" }}>{e.name}</h2>
              <h3 style={{ margin: "6px 2px" }}>
                {durationInMs(e.duration_ms)}
              </h3>
              <p style={{ margin: "6px 2px" }}>
                {e.artists.map((e) => `${e.name}  `)}
              </p>
            </a>
          </div>
        );
      })}
          </>
        )
      }
    </div>
  );
}

export default App;
