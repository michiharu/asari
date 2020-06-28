import React, { useState } from "react";
import _ from "lodash";
import equal from "fast-deep-equal";
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

export const size = "calc(100% * 1 / 20)";

export const cellSize = 48;

export type Rule = {
  index: number;
  pattarn: number[];
  isLeft?: boolean;
  selectedIndex: number;
};

const createInitTwoCellRules = (colors: string[]): Omit<Rule, "index">[] => {
  return _(
    [0, 1].map((right) =>
      colors.map((__, first) =>
        colors.map((___, second) => ({
          pattarn: [first, second],
          isLeft: !Boolean(right),
          selectedIndex: _.random(0, colors.length - 1),
        }))
      )
    )
  )
    .flattenDeep()
    .value();
};

const createInitThreeCellRules = (colors: string[]): Omit<Rule, "index">[] => {
  return _(
    colors.map((__, first) =>
      colors.map((___, second) =>
        colors.map((___, third) => ({
          pattarn: [first, second, third],
          selectedIndex: _.random(0, colors.length - 1),
        }))
      )
    )
  )
    .flattenDeep()
    .value();
};

const createCellRules = (colors: string[]): Rule[] => {
  return _.concat(createInitTwoCellRules(colors), createInitThreeCellRules(colors)).map((r, index) => ({
    ...r,
    index,
  }));
};

const coloringNextRow = (rules: Rule[], beforeRow: number[]): number[] => {
  const last = beforeRow.length - 1;
  return beforeRow.map((__, index, arr) => {
    if (index === 0) {
      return rules.find((r) => equal(r.pattarn, [arr[0], arr[1]]) && r.isLeft)!.selectedIndex;
    }
    if (index === last) {
      return rules.find((r) => equal(r.pattarn, [arr[last - 1], arr[last]]) && r.isLeft === false)!.selectedIndex;
    }
    console.log(rules)
    console.log([arr[index - 1], arr[index], arr[index + 1]])
    return rules.find((r) => equal(r.pattarn, [arr[index - 1], arr[index], arr[index + 1]]))!.selectedIndex;
  });
};

const coloringAllCell = (rules: Rule[], firstRow: number[], rowCount: number): number[][] => {
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
  const [colorCount, setColorCount] = useState(2);
  const [colors, setColors] = useState(defaultColors.slice(0, colorCount));
  const [pickerIndex, setPickerIndex] = useState<number | undefined>();
  const [coloringRules, setColoringRules] = useState<Rule[]>(createCellRules(colors));
  const [colCount, setColCount] = useState(12);
  const [firstRow, setFirstRow] = useState([...Array(12)].map(() => _.random(0, colors.length - 1)));

  const handleColorCount = (e: any, countString: string) => {
    const count = Number(countString);
    setColorCount(count);
    const nextColors = defaultColors.slice(0, count);
    setColors(nextColors);
    setColoringRules(createCellRules(nextColors));
    setFirstRow(firstRow.map(c => c % nextColors.length))
  };

  const setColor = (index: number) => (color: string) => {
    setColors(colors.map((c, i) => (i === index ? color : c)));
  };

  const handleSelectCellColorIndex = (rule: Rule, selected: number) => {
    setColoringRules(coloringRules.map((r, i) => (i === rule.index ? { ...r, selectedIndex: selected } : r)));
  };

  const handleColCount = (e: any, v: number | number[]) => {
    const value = v as number;
    if (value === colCount) {
      return;
    }
    if (value < colCount) {
      setFirstRow(firstRow.filter((__, index) => index < value));
    } else {
      setFirstRow(firstRow.concat([...Array(value - colCount)].map(() => _.random(0, colors.length - 1))));
    }
    setColCount(value);
  };

  const handleFirstSelect = (index: number, colorIndex: number) => {
    setFirstRow(firstRow.map((c, i) => (i === index ? colorIndex : c)));
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
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
        <Box p={2} bgcolor="#0001" maxHeight="100vh" style={{ overflow: "scroll" }}>
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
              <RuleBox allColors={colors} rule={rule} select={handleSelectCellColorIndex} />
            ))}
          </Box>
        </Box>
        <Box flexGrow={1} p={2}>
          <Typography variant="caption">Elementary Cellular Automaton</Typography>
          <Typography variant="h3">アサリの模様</Typography>
          <Box>
            <Box pt={5}>
              <Box mt={2} ml="calc(100% * 5.25 / 42 )" width="calc(100% * 35.7 / 42)">
                <Slider
                  defaultValue={colCount}
                  valueLabelDisplay="auto"
                  marks
                  min={3}
                  max={20}
                  onChangeCommitted={handleColCount}
                />
              </Box>
            </Box>
            <FirstRow allColors={colors} firstRow={firstRow} firstSelect={handleFirstSelect} />
            {rows.map((row) => (
              <Box display="flex">
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
