import React, { useState } from "react";
import equal from "deep-equal";
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
  Slider,
} from "@material-ui/core";
import { ColorPicker } from "./ColorPicker";
import RuleBox from "./RuleBox";
import FirstRow from "./FirstRow";

const defaultColors = ["#5FF7EE", "#D6784B", "#FFFFFF"];

const colCount = 61;
export const size = `calc(100% * 1 / ${colCount})`;

export const cellSize = 48;

export type Rule = {
  index: number;
  pattarn: [number, number, number];
  selectedIndex: number;
};

const range = (index: number): number[] => [...Array(index)].map((_, i) => i);
const random = (int: number): number => Math.floor(Math.random() * int);

const createInitThreeCellRules = (colors: string[]): Omit<Rule, "index">[] => {
  const len = colors.length;
  const result: Omit<Rule, "index">[] = [];
  range(len).forEach((first) =>
    range(len).forEach((second) =>
      range(len).forEach((third) =>
        result.push({
          pattarn: [first, second, third],
          selectedIndex: random(len),
        })
      )
    )
  );
  return result;
};

const createCellRules = (colors: string[]): Rule[] => {
  return createInitThreeCellRules(colors).map((r, index) => ({ ...r, index }));
};

const coloringNextRow = (rules: Rule[], before: number[]): number[] => {
  const nextLength = before.length - 2;
  if (nextLength < 1) return [];
  const result: number[] = [];
  for (let i = 0; i < nextLength; i++) {
    const rule = rules.find((r) =>
      equal(r.pattarn, [before[i], before[i + 1], before[i + 2]])
    );
    if (!rule) throw new Error();
    result.push(rule.selectedIndex);
  }
  return result;
};

const coloringAllCell = (
  rules: Rule[],
  firstRow: number[],
  rowCount: number
): number[][] => {
  console.log(firstRow);

  const rows: number[][] = [];
  let beforeRow = firstRow;
  for (let i = 0; i < rowCount; i++) {
    const nextRow = coloringNextRow(rules, beforeRow);
    rows.push(nextRow);
    beforeRow = nextRow;
  }

  return rows;
};

export default function App() {
  const [colorCount, setColorCount] = useState(3);
  const [colors, setColors] = useState(defaultColors.slice(0, colorCount));
  const [pickerIndex, setPickerIndex] = useState<number | undefined>();
  const [coloringRules, setColoringRules] = useState<Rule[]>(
    createCellRules(colors)
  );
  const [firstRow, setFirstRow] = useState(
    range(colCount).map(() => random(colors.length))
  );

  const handleColorCount = (e: any, countString: string) => {
    const count = Number(countString);
    setColorCount(count);
    const nextColors = defaultColors.slice(0, count);
    setColors(nextColors);
    setColoringRules(createCellRules(nextColors));
    setFirstRow(firstRow.map((c) => c % nextColors.length));
  };

  const setColor = (index: number) => (color: string) => {
    setColors(colors.map((c, i) => (i === index ? color : c)));
  };

  const handleSelectCellColorIndex = (rule: Rule, selected: number) => {
    setColoringRules(
      coloringRules.map((r, i) =>
        i === rule.index ? { ...r, selectedIndex: selected } : r
      )
    );
  };

  const handleFirstSelect = (index: number, colorIndex: number) => {
    setFirstRow(firstRow.map((c, i) => (i === index ? colorIndex : c)));
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen =
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setPickerIndex(index);
    };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const rows = coloringAllCell(coloringRules, firstRow, 50);

  return (
    <div>
      <Box display="flex">
        <Box
          p={2}
          bgcolor="#0001"
          maxHeight="100vh"
          style={{ overflow: "scroll" }}
        >
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
            <Box display="flex" pt={1}>
              {colors.map((color, index) => (
                <Box key={index} ml={index === 0 ? 0 : 2}>
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
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
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
            {coloringRules.map((rule) => (
              <RuleBox
                allColors={colors}
                rule={rule}
                select={handleSelectCellColorIndex}
              />
            ))}
          </Box>
        </Box>
        <Box flexGrow={1} p={2}>
          <Typography variant="caption">
            Elementary Cellular Automaton
          </Typography>
          <Typography variant="h3">アサリの模様</Typography>
          <Box pt={5}>
            <FirstRow
              allColors={colors}
              firstRow={firstRow}
              firstSelect={handleFirstSelect}
            />
            {rows.map((row, i) => (
              <Box display="flex">
                {range(i + 1).map((index) => (
                  <Box key={index} width={size} pt={size} bgcolor={"#0000"} />
                ))}
                {row.map((colorIndex, index) => (
                  <Box
                    key={index}
                    width={size}
                    pt={size}
                    bgcolor={colors[colorIndex]}
                    border="1px solid #fff"
                    borderRadius={4}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
