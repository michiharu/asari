import React, { useState } from 'react';
import {
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  Card,
  CardActionArea,
  Popover,
} from '@mui/material';
import { ColorPicker } from './ColorPicker';
import RuleBox from './RuleBox';
import RowsRenderer from './RowsRenderer';
import { range } from './funcs';

const defaultColors = ['#5FF7EE', '#D6784B', '#999999FF'];
export const colCount = 301;
export const size = `calc(100% / ${colCount})`;
export const cellSize = 48;

export type RuleState = {
  ids: string[];
  entities: { [key: string]: number };
};
const random = (int: number): number => Math.floor(Math.random() * int);

const createRules = (colorCount: number): RuleState => {
  const ids: string[] = [];
  const entities: { [key in string]: number } = {};
  range(colorCount).forEach((first) =>
    range(colorCount).forEach((second) =>
      range(colorCount).forEach((third) => {
        const key = `${first}-${second}-${third}`;
        ids.push(key);
        const selectedIndex = random(colorCount);
        entities[key] = selectedIndex;
      })
    )
  );
  return { ids, entities };
};

const coloringRowRecursive = (ruleState: RuleState, rows: number[][]): number[][] => {
  const { length, [length - 1]: before } = rows;
  const next = before.length - 2;
  if (next < 1) return rows;
  const row: number[] = [];
  for (let i = 0; i < next; i++) {
    const key = `${before[i]}-${before[i + 1]}-${before[i + 2]}`;
    row.push(ruleState.entities[key]);
  }

  return coloringRowRecursive(ruleState, rows.concat([row]));
};

const App: React.FC = () => {
  const [colorCount, setColorCount] = useState(3);
  const [colors, setColors] = useState(defaultColors.slice(0, colorCount));
  const [pickerIndex, setPickerIndex] = useState<number | undefined>();
  const [ruleState, setRuleState] = useState<RuleState>(createRules(colorCount));
  const [firstRow, setFirstRow] = useState(range(colCount).map(() => random(colors.length)));

  const handleColorCount = (e: React.ChangeEvent<HTMLInputElement>, countString: string): void => {
    const count = Number(countString);
    setColorCount(count);
    const nextColors = defaultColors.slice(0, count);
    setColors(nextColors);
    setRuleState(createRules(count));
    setFirstRow(firstRow.map((c) => c % nextColors.length));
  };

  const setColor =
    (index: number) =>
    (color: string): void => {
      setColors(colors.map((c, i) => (i === index ? color : c)));
    };

  const handleSelectCellColorIndex = (id: string, selected: number): void => {
    setRuleState((state) => ({
      ...state,
      entities: { ...state.entities, [id]: selected },
    }));
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPickerIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const rows = coloringRowRecursive(ruleState, [firstRow]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
      <Box sx={{ width: 200, p: 2, bgcolor: '#0001', overflow: 'scroll' }}>
        <Box>
          <FormControl component="fieldset">
            <FormLabel component="legend">色の数</FormLabel>
            <RadioGroup value={colorCount} onChange={handleColorCount}>
              <FormControlLabel value={2} control={<Radio />} label="2色" />
              <FormControlLabel value={3} control={<Radio />} label="3色" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box pt={2}>
          <Typography>色の選択</Typography>
          <Box display="flex" justifyContent="center" pt={1}>
            {colors.map((color, index) => (
              <Box key={index} ml={index === 0 ? 0 : 1}>
                <Card style={{ width: cellSize, height: cellSize }}>
                  <CardActionArea onClick={handleOpen(index)}>
                    <Box width={cellSize} height={cellSize} bgcolor={color} />
                  </CardActionArea>
                </Card>
                <Popover
                  open={Boolean(anchorEl) && index === pickerIndex}
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
                  <ColorPicker color={color} setColor={setColor(index)} />
                </Popover>
              </Box>
            ))}
          </Box>
        </Box>
        <Box pt={2}>
          <Typography>ルール</Typography>
          {ruleState.ids.map((id, index) => (
            <RuleBox
              key={index}
              allColors={colors}
              index={index}
              id={id}
              selected={ruleState.entities[id]}
              select={handleSelectCellColorIndex}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, width: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ m: 2 }}>
            <Typography variant="caption">Elementary Cellular Automaton</Typography>
            <Typography variant="h3">アサリの模様</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, height: 2, p: 2 }}>
            <RowsRenderer rows={rows} colors={colors} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
