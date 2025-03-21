import "./App.css";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const artistData = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        console.log("data", data);
        const artistInfo = data.artists.items[0];
        setArtist(artistInfo); // Stocker les infos de l'artiste
        return artistInfo.id;
      });

    await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistData +
        "/albums?include_groups=album&market=US&limit=50",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }

  return (
    <>
      <main>Search for Artist !</main>
      <Container style={{ display: "flex", justifyContent: "center" }}>
        <InputGroup>
          <FormControl
            placeholder="Here !"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            style={{
              width: "300px",
              height: "30px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
              backgroundColor: "white",
              color: "black",
              marginTop: "10%",
            }}
          />
          <Button
            style={{ backgroundColor: "#800080", color: "white" }}
            onClick={search}
          >
            Search
          </Button>
        </InputGroup>
      </Container>

      {/* Affichage de l'artiste */}
      {artist && (
        <Container>
          <Card
            style={{
              backgroundColor: "white",
              margin: "20px auto",
              borderRadius: "5px",
              padding: "20px",
              textAlign: "center",
              width: "500px",
              maxWidth: "90%",
            }}
          >
            <Card.Img
              variant="top"
              src={artist.images[0]?.url}
              style={{
                borderRadius: "50%",
                width: "200px",
                height: "200px",
                margin: "auto",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              }}
            />
            <Card.Body>
              <Card.Text
                style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}
              >
                {artist.name}
              </Card.Text>
              <Card.Text style={{ fontSize: "18px", color: "black" }}>
                Followers: {artist.followers.total.toLocaleString()}
              </Card.Text>
              <Card.Text style={{ fontSize: "16px", color: "black" }}>
                Genre:{" "}
                {artist.genres.join(", ") ? artist.genres.join(", ") : "N/A"}
              </Card.Text>
              <Button
                href={artist.external_urls.spotify}
                target="_blank"
                style={{
                  backgroundColor: "#800080",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "15px",
                  borderRadius: "5px",
                  padding: "10px",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  position: "absolute",
                }}
              >
                Spotify Profile
              </Button>
            </Card.Body>
          </Card>
        </Container>
      )}

      {/* Affichage des albums */}
      <Container>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
            marginTop: "50px",
          }}
        >
          {albums.map((album) => {
            return (
              <Card
                key={album.id}
                style={{
                  backgroundColor: "white",
                  margin: "10px",
                  borderRadius: "5px",
                  marginBottom: "30px",
                }}
              >
                <Card.Img
                  width={200}
                  src={album.images[0].url}
                  style={{
                    borderRadius: "4%",
                    marginTop: "4%",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                  }}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      whiteSpace: "wrap",
                      fontWeight: "bold",
                      maxWidth: "200px",
                      fontSize: "16px",
                      marginTop: "10px",
                      color: "black",
                      textAlign: "center",
                      margin: "auto",
                    }}
                  >
                    {album.name}
                  </Card.Title>
                  <Card.Text style={{ color: "black", fontSize: "16px" }}>
                    Release Date: <br /> {album.release_date}
                  </Card.Text>
                  <Card.Text style={{ color: "black", fontSize: "16px" }}>
                    Number of Tracks: <br /> {album.total_tracks}
                  </Card.Text>
                  <Button
                    href={album.external_urls.spotify}
                    target="_blank"
                    style={{
                      backgroundColor: "#800080",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                      borderRadius: "5px",
                      padding: "10px",
                      bottom: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      position: "absolute",
                    }}
                  >
                    Album Link
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </>
  );
}

export default App;
