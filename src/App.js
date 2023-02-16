import React, { useState, useEffect, useCallback } from "react";
import Map, {
  Marker,
  FullscreenControl,
  NavigationControl,
  Popup,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import StarIcon from "@mui/icons-material/Star";
import RoomIcon from "@mui/icons-material/Room";
import Register from "./components/Register";
import Login from './components/Login';

function App() {
  const loginTravelAppStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(loginTravelAppStorage.getItem('user') || null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -117,
    latitude: 32.597,
    zoom: 9,
  });
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [rating, setRating] = useState();
  const mapRef = React.useRef();

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, [setPins]);

  const handleMarkerClick = useCallback((id, lat, lng) => {
    setCurrentPlaceId(id);
    setViewState({...viewState, latitude: lat, longitude: lng})
  },[setCurrentPlaceId, setViewState])

  const handleAddClick = useCallback((e) => {
    if(!currentUser){

      setShowLogin(true);
      return 
    }

    setShowLogin(false)
    const {lng, lat} = e.lngLat;
    setNewPlace({long: lng, lat});
  },[currentUser, setShowLogin, setNewPlace]);



  const handleSubmit = async (e) => {
    e.preventDefault()
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }
    
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    }catch(err) {
      console.log(err)
    }
    
  }

  const handleLogout = useCallback(() => {
    loginTravelAppStorage.removeItem('users');
    setCurrentUser(null);
  },[]);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      style={{
        width: "100vw",
        height: "100vh",
      }}
      {...viewState}
      doubleClickZoom={false}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={(e) => handleAddClick(e)}
    >
      {pins?.map((p, index) => (
        <React.Fragment key={index}>
          <Marker
            offset={[0, 0]}
            longitude={p.long}
            latitude={p.lat}
            anchor="top"
            draggable={true}
          >
            <RoomIcon onClick={() => handleMarkerClick(p._id, p.lat, p.long)} style={{color: 'slateblue'}}/>
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
            >
              <div>
                <label>Place</label>
                <h4>{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div>
                  {Array(p.rating).fill(<StarIcon className="star" />)}
                </div>
                <label>Information</label>
                <p className="username">
                  Created By: <b>{p.username}</b>
                </p>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input 
              placeholder="Enter a title"
              onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea placeholder="Say something about this place"
              onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select               
              onChange={(e) => setRating(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </div>
          </Popup>
      )}
      <NavigationControl position="top-right" />
      <FullscreenControl />
      { currentUser ? (
      <button className="button logout" onClick={handleLogout}>Log Out</button>) 
        : (
        <div className='buttons'>
          <button className="button login" disabled={showRegister} onClick={() => setShowLogin(true)}>Login</button>
          <button className="button register" disabled={showLogin} onClick={() => setShowRegister(true)}>Register</button>
        </div>)
        }
      { showRegister &&
        <Register  
        setShowRegister={setShowRegister}
        onSetCurrentUser={setCurrentUser}
        loginTravelAppStorage={loginTravelAppStorage}
      />
      }
      { showLogin  && <Login 
        setShowLogin={setShowLogin} 
        loginTravelAppStorage={loginTravelAppStorage}
        onSetCurrentUser={setCurrentUser}
      />
      }
    </Map>
  );
}

export default App;
