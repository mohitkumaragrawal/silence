import ax from "axios";

const axios = ax.create({
  baseURL: process.env.REACT_APP_BACKEND,
});

axios.interceptors.request.use((req) => {
  let newReq = req;
  const token = localStorage.getItem("auth-token");
  if (token == null) {
    return req;
  }
  newReq.headers = {
    Authorization: token,
    ...req.headers,
  };
  return newReq;
});

export default axios;
