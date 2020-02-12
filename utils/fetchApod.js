import fetch from "isomorphic-unfetch";

const API_KEY = "ioafLpIuFKhsNMgz3s5KpfyQ9LjzcztOK1UqAHCq";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

export default function fetchApod({ date } = {}) {
  const url = new URL(BASE_URL);
  const params = {
    api_key: API_KEY,
    hd: true
  };

  if (date) {
    params.date = date;
  }

  url.search = new URLSearchParams(params).toString();

  // console.log(url.toString());

  return fetch(url.toString()).then(r => r.json());
}
