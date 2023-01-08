import ax from "axios";

const axios = ax.create({
  baseURL: "https://content-api.bobbleapp.me/",
});

export default axios;
