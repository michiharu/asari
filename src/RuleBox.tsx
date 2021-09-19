import React from "react";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Card,
  CardActionArea,
} from "@material-ui/core";
import PaletteIcon from "@material-ui/icons/Palette";
import { cellSize, Rule } from "./App";

interface Props {
  allColors: string[];
  rule: Rule;
  select: (rule: Rule, selected: number) => void;
}

const transparent = "#0000";
const blank = -1;

export default function RuleBox(props: Props) {
  const { allColors, rule, select } = props;
  const { index, pattarn, selectedIndex } = rule;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectColor = (index: number) => () => {
    setAnchorEl(null);
    select(rule, index);
  };

  const open = Boolean(anchorEl);

  const cells = [selectedIndex];
  return (
    <Box py={1}>
      <Typography variant="caption">{`No. ${index + 1}`}</Typography>
      <Box
        display="flex"
        justifyContent="center"
        width={cellSize * pattarn.length}
      >
        {pattarn.map((colorIndex, i) => (
          <Box
            key={i}
            width={cellSize}
            height={cellSize}
            bgcolor={allColors[colorIndex]}
            borderRadius={4}
          />
        ))}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        width={cellSize * pattarn.length}
      >
        {cells.map((colorIndex) => {
          if (colorIndex === blank) {
            return (
              <Box width={cellSize} height={cellSize} bgcolor={transparent} />
            );
          }
          return (
            <Box bgcolor={allColors[colorIndex]} borderRadius={4}>
              <IconButton onClick={handleOpen}>
                <PaletteIcon />
              </IconButton>
            </Box>
          );
        })}
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
              <Card
                key={colorIndex}
                style={{ width: cellSize, height: cellSize }}
              >
                <CardActionArea onClick={handleSelectColor(colorIndex)}>
                  <Box width={cellSize} height={cellSize} bgcolor={color} />
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
