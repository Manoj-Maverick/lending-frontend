import React from "react";
import Image from "components/AppImage";
import { resolvePersonImage } from "utils/personMedia";

const PersonAvatar = ({
  person,
  name,
  gender,
  src,
  alt,
  className = "",
  ...props
}) => {
  const resolvedPerson = {
    ...(person || {}),
    ...(name ? { name } : {}),
    ...(gender ? { gender } : {}),
    ...(src ? { image: src } : {}),
  };

  return (
    <Image
      src={resolvePersonImage(resolvedPerson)}
      alt={alt || resolvedPerson.name || "Profile"}
      className={className}
      {...props}
    />
  );
};

export default PersonAvatar;
