import { useState, useEffect } from "react";
import axios from "../helpers/axiosBobble";

export interface Media {
  height: number;
  width: number;
  gif?: {
    url: string;
  };
  png?: {
    url: string;
  };
}

export interface Content {
  id: number;
  type: string;
  media: {
    fixedWidthSmall: Media;
    fixedWidthMedium: Media;
    fixedWidthFull: Media;
  };
}

const useStickers = () => {
  const [intent, setIntent] = useState("welcome");
  const [stickerData, setStickerData] = useState<Array<Content>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/v4/contents/search?gender=unisex&intent=${intent}&limit=5`, {
        headers: {
          "x-api-key": "w5P2sRua9tNw3zqDCL71rD9UjeQkffd5ZMn0CeZ_58o",
        },
      })
      .then((value) => {
        setStickerData(value.data.contents);
        setLoading(false);
      });
  }, [intent]);

  return { intent, setIntent, stickerData, loading };
};

export default useStickers;
