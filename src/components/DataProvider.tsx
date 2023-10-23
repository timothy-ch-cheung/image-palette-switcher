import { createContext, useContext, useState } from "react";
import { LoadedImage } from "./ImageDisplay";

type SharedDataContextType = {
  srcImage?: LoadedImage;
  replaceSrcImage: (img: LoadedImage | undefined) => void;
  updateSrcImage: (img: LoadedImageUpdate) => void;
};
const SharedDataContext = createContext<SharedDataContextType>({
  replaceSrcImage: () => {},
  updateSrcImage: () => {},
});

export function useSharedData() {
  return useContext(SharedDataContext);
}

interface LoadedImageUpdate extends Partial<LoadedImage> {}

interface DataProviderProps {
  children: React.ReactNode;
}
export function DataProvider(props: DataProviderProps) {
  const [srcImage, setSrcImage] = useState<LoadedImage | undefined>(undefined);

  const replaceSrcImage = (newImg: LoadedImage | undefined) => {
    setSrcImage(newImg);
  };

  const updateSrcImage = (newData: LoadedImageUpdate) => {
    setSrcImage((prevState) => {
      if (prevState !== undefined) {
        return { ...prevState, ...newData };
      } else {
        return undefined;
      }
    });
  };

  return (
    <SharedDataContext.Provider
      value={{ srcImage, replaceSrcImage, updateSrcImage }}
    >
      {props.children}
    </SharedDataContext.Provider>
  );
}
