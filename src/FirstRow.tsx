import React, { useState } from "react";
import { Box, Paper, IconButton, Popover, Typography, Divider, Card, CardActionArea } from "@material-ui/core";
import PaletteIcon from "@material-ui/icons/Palette";
import { cellSize, size } from "./App";

interface Props {
  allColors: string[];
  firstRow: number[];
  firstSelect: (index: number, colorIndex: number) => void;
}

export default function FirstRow(props: Props) {
  const { allColors, firstRow, firstSelect } = props;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpenIndex(null);
    setAnchorEl(null);
  };

  const handleSelectColor = (colorIndex: number) => () => {
    firstSelect(openIndex!, colorIndex);
    setOpenIndex(null);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box display="flex">
      {firstRow.map((colorIndex, index) => (
        <Box
          key={index}
          width={size}
          pt={size}
          bgcolor={allColors[colorIndex]}
          onClick={handleOpen(index)}
          border="1px solid #fff"
          borderRadius={4}
          position="relative"
          style={{ cursor: "pointer" }}
        >
          <PaletteIcon style={{ position: "absolute", top: 0, left: 0 }}/>
        </Box>
      ))}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box display="flex">
          {allColors.map((color, colorIndex) => (
            <Card key={colorIndex} style={{ width: cellSize, height: cellSize }}>
              <CardActionArea onClick={handleSelectColor(colorIndex)}>
                <Box width={cellSize} height={cellSize} bgcolor={color} />
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}
