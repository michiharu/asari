import React from "react";
import { ChromePicker } from "react-color";

interface Props { color: string; setColor: (color: string) => void }

export const ColorPicker: React.FC<Props> = (props) => {
  const { color, setColor } = props;
  return <ChromePicker disableAlpha color={color} onChange={(c) => setColor(c.hex)} />;
};
