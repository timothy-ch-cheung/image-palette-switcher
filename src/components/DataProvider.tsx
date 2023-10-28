import { createContext, useContext, useState } from "react";
import { Dimensions, LoadedImage } from "./ImageDisplay";
import { PaletteColour } from "./PaletteSelecter";

type SharedDataContextType = {
  srcImage?: LoadedImage;
  replaceSrcImage: (img: LoadedImage | undefined) => void;
  updateSrcImage: (img: LoadedImageUpdate) => void;

  palette: PaletteColour[];
  replacePalette: (palette: PaletteColour[]) => void;
  addToPalette: (colour: PaletteColour) => void;

  targetDimensions: Dimensions;
  updateTargetDimensions: (dimensions: Dimensions) => void;

  isPixelArt: boolean;
  updateIsPixelArt: (isPixelArt: boolean) => void;
};
const SharedDataContext = createContext<SharedDataContextType>({
  replaceSrcImage: () => {},
  updateSrcImage: () => {},

  palette: [],
  replacePalette: () => {},
  addToPalette: () => {},

  targetDimensions: {
    width: 0,
    height: 0,
  },
  updateTargetDimensions: () => {},

  isPixelArt: true,
  updateIsPixelArt: () => {},
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
      newState.push(paletteColour);
      return newState;
    });
  };

  const [targetDimensions, setTargetDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const updateTargetDimensions = (dimensions: Dimensions) => {
    setTargetDimensions(dimensions);
  };

  const [isPixelArt, setIsPixelArt] = useState<boolean>(true);

  const updateIsPixelArt = (isPixelArt: boolean) => {
    setIsPixelArt(isPixelArt);
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
        targetDimensions,
        updateTargetDimensions,
        isPixelArt,
        updateIsPixelArt,
      }}
    >
      {props.children}
    </SharedDataContext.Provider>
  );
}
