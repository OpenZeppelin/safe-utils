import React, { useMemo } from 'react';
import {blo} from 'blo';

interface PixelAvatarProps {
  address: string;
  size?: number;
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({ address, size = 20 }) => {
  const style = useMemo(() => {
    const blockie = blo(address as `0x${string}`)
    return {
      backgroundImage: `url(${blockie})`,
      backgroundSize: 'contain',
      borderRadius: '50%',
      width: `${size}px`,
      height: `${size}px`,
    }
  }, [address, size]);

  return (
      <div style={style}/>
  );
};

export default PixelAvatar;