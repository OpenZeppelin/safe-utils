import React, { useMemo } from 'react';
import {blo} from "blo";

interface PixelAvatarProps {
  address: string;
  size?: number;
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({ hexValue, size = 30 }) => {
  const style = useMemo(() => {
    const blockie = blo(hexValue as `0x${string}`)
    return {
      backgroundImage: `url(${blockie})`,
      backgroundSize: 'contain',
      width: `${size}px`,
      height: `${size}px`,
    }
  }, [hexValue, size]);

  return (
      <div style={style} />
  );
};

export default PixelAvatar;

