import { createContext, useContext, useState } from "react";
import { LoadedImage } from "./ImageDisplay";
import { PaletteColour } from "./PaletteSelecter";

type SharedDataContextType = {
  srcImage?: LoadedImage;
  replaceSrcImage: (img: LoadedImage | undefined) => void;
  updateSrcImage: (img: LoadedImageUpdate) => void;

  palette: PaletteColour[];
  replacePalette: (palette: PaletteColour[]) => void;
  addToPalette: (colour: PaletteColour) => void;
};
const SharedDataContext = createContext<SharedDataContextType>({
  replaceSrcImage: () => {},
  updateSrcImage: () => {},

  palette: [],
  replacePalette: () => {},
  addToPalette: () => {},
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

  const [palette, setPalette] = useState<PaletteColour[]>([]);

  const replacePalette = (newPalette: PaletteColour[]) => {
    setPalette(newPalette);
  };

  const addToPalette = (paletteColour: PaletteColour) => {
    setPalette((prevState) => {
      const newState = [...prevState];
      newState.push(paletteColour)
      return newState;
    });
  };

  return (
    <SharedDataContext.Provider
      value={{
        srcImage,
        replaceSrcImage,
        updateSrcImage,
        palette,
        replacePalette,
        addToPalette,
      }}
    >
      {props.children}
    </SharedDataContext.Provider>
  );
}
