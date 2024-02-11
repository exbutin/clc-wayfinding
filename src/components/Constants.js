import {
  FaSquareParking,
  FaChair,
  FaRestroom,
  FaTaxi,
  FaShirt,
  FaStairs,
  FaDroplet,
  FaPeopleArrows,
  FaBriefcaseMedical,
  FaCircleQuestion,
} from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { createTheme } from '@material-ui/core/styles';

export const defaultLocation = [-97.143743, 49.89269]; // [longitude, latitude]
export const defaultLocationName = "CLC";
export const defaultZoomLevel = 17.5;
export const defaultPitch = 0;
export const defaultParkingZoomLevel = 15;
export const defaultTransitZoomLevel = 16;
export const defaultMaxWidth = 500;
export const defaultBearing = -19;
export const venueImageCoordinates = [
  [-97.14497481580044, 49.89361222151233],
  [-97.14241221867809, 49.89361222151233],
  [-97.14241221867809, 49.891636621783406],
  [-97.14497481580044, 49.891636621783406],
];
export const defaultLevel = 1;
export const colors = {
  primary: "#003366",
  secondary: "#0038A8",
  success: "#99edc3",
  info: "rgba(236,241,247,.25)",
  warning: "#e9d502",
  danger: "#Ff4757",
  light: "#ECF1F7",
  dark: "#63666A",
};
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
  shape: {
  },
  overrides: {
    MuiButton: {
      root: {
        boxShadow: '10px 10px 10px 10px rgba(0,0,0,0.2)',
      },
    },
  },
});
export const defaultSymbolSize = [
  "interpolate",
  ["exponential", 1.5],
  ["zoom"],
  //when zoom is 15, icon-size is 0
  15,
  0,
  //when zoom is 10, icon-size is 0.5
  22,
  0.32,
];
export const defaultTextSize = [
  "interpolate",
  ["exponential", 1.5],
  ["zoom"],
  //when zoom is 15, icon-size is 0
  15,
  0,
  //when zoom is 10, icon-size is 0.5
  22,
  100,
];
export const defaultSymbolPulseSize = 18;
export const defaultSymbolPulseSpeed = 0.01;
export const options = [
  {
    category: ["merchandise"],
    name: "Merchandise",
    img: "/landing page images/Merchandise.jpg",
    icon: <FaShirt />,
  },
  {
    category: ["fab"],
    name: "Food & Beverage",
    img: "/landing page images/Food & Beverage.jpg",
    icon: <IoFastFood />,
  },
  {
    category: ["parking"],
    name: "Parking",
    img: "/landing page images/PArking.jpg",
    icon: <FaSquareParking />,
  },
  {
    category: ["gate", "stairs", "elevator"],
    name: "Entry, Stairs, & Elevators",
    img: "/landing page images/Entry & Stairs.jpg",
    icon: <FaStairs />,
  },
  {
    category: ["section", "accessibility"],
    name: "Seat Search",
    img: "/landing page images/Seat Search.jpg",
    icon: <FaChair />,
  },
  {
    category: ["washroom"],
    name: "Washrooms",
    img: "/landing page images/Restrooms.jpg",
    icon: <FaRestroom />,
  },
  {
    category: ["fountain"],
    name: "Drinking Fountains",
    img: "/landing page images/Drinking Fountain.jpg",
    icon: <FaDroplet />,
  },
  {
    category: ["meetup", "attraction", "event"],
    name: "Meetup Locations & Attractions",
    img: "/landing page images/Meetup Locations.jpg",
    icon: <FaPeopleArrows />,
  },
  {
    category: ["medical"],
    name: "Medical",
    img: "/landing page images/First Aid.jpg",
    icon: <FaBriefcaseMedical />,
  },
  {
    category: ["gate", "transit", "stairs", "elevator"],
    name: "Transit & Rideshare",
    img:
      process.env.PUBLIC_URL +
      "/landing page images/Exit, Transit, Rideshare.jpeg",
    icon: <FaTaxi />,
  },
  {
    category: ["services"],
    name: "Services",
    img:
      process.env.PUBLIC_URL +
      "/landing page images/Exit, Transit, Rideshare.jpeg",
    icon: <FaCircleQuestion />,
  },
];
