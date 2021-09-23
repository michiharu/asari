import React from 'react';
import { Box, Popover, Typography, Card, CardActionArea } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { cellSize } from './App';
interface Props {
  allColors: string[];
  index: number;
  id: string;
  selected: number;
  select: (id: string, selected: number) => void;
}

const RuleBox: React.FC<Props> = (props) => {
  const { allColors, index, id, selected, select } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectColor = (next: number) => () => {
    setAnchorEl(null);
    select(id, next);
  };

  const open = Boolean(anchorEl);

  return (
    <Box py={1}>
      <Typography variant="caption" sx={{ ml: 1 }}>{`No. ${index + 1}`}</Typography>
      <Box display="flex" justifyContent="center">
        {id.split('-').map((colorIndex, i) => (
          <Card key={i} sx={{ width: cellSize, height: cellSize, ml: i === 0 ? 0 : 1 }}>
            <Box width={cellSize} height={cellSize} bgcolor={allColors[Number(colorIndex)]} />
          </Card>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" mt={1}>
        <Card style={{ width: cellSize, height: cellSize }}>
          <CardActionArea onClick={handleOpen}>
            <Box
              width={cellSize}
              height={cellSize}
              bgcolor={allColors[selected]}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <PaletteIcon />
            </Box>
          </CardActionArea>
        </Card>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
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
    </Box>
  );
};

export default RuleBox;
