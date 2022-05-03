import TodayCard from "../Comps/todayCard/TodayCard";
import "./home.scss";
import Card from "../Comps/card/Card.jsx";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import Cards from "../Comps/card/Cards";
import { ToastContainer, toast } from "react-toastify";
import BasicModal from "../Comps/basicModal/BasicModal";

const apiKey = "gW5QmxlArGWpmdT9vPd1rEW6qQyAwyJH";

export default function Home() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { storeLocation, storeFavorite, storeKey, isFavorite } =
    bindActionCreators(actionCreators, dispatch);

  const [city, setCity] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [data, setData] = useState(["Enter"]);

  const handleSubmit = () => {
    if (!/^[a-zA-Z\s]*$/.test(inputValue) || inputValue === "") {
      setError(true);
      setErrorText("Only English Letters");
    } else {
      setError(false);
      getLocation();
    }
    // AutoInput(inputValue);
  };

  const getLocation = () => {
    try {
      axios
        .get(
          `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${inputValue}&language=en-us`
        )
        .then((res) => {
          const location = res.data;
          console.log(location.length);
          if (location.length > 0) {
            storeLocation(location[0].LocalizedName);
            storeKey(location[0].Key);
          } else {
            setError(true);
            setErrorText("There is no city as you asked for,try again");
          }
        });
    } catch (err) {
      console.log(err.response.message);
    }
  };

  const AutoInput = (value) => {
    try {
      axios
        .get(
          `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${value}&language=en-us`
        )
        .then((res) => {
          const location = res.data;
          console.log(location);
          setData(location);
        });
    } catch (err) {
      console.log(err.response.message);
    }
  };
  return (
    <div className="home">
      <div className="input">
        <Autocomplete
          freeSolo
          id="combo-box-demo"
          options={data ? data?.map((city1) => city1.LocalizedName) : []}
          onChange={(event, newValue) => {
            //setLocation(newValue?.LocalizedName);
            console.log(city);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            AutoInput(newInputValue);
          }}
          getOptionLabel={(option) => option || ""}
          isOptionEqualToValue={(option, value) =>
            option.LocalizedName === value.LocalizedName
          }
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="outlined-basic"
              variant="outlined"
              label="Search"
              sx={{
                backgroundColor: "white",
                borderBlock: "black",
                width: 380,
              }}
            />
          )}
        />

        <IconButton color="secondary" size="small" onClick={handleSubmit}>
          <SearchIcon />
        </IconButton>
      </div>
      <div className="Cards">
        <TodayCard />
      </div>
      <Cards />
      {error && <BasicModal text={errorText} />}
    </div>
  );
}
