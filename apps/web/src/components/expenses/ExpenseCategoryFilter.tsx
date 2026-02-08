import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

interface ExpenseCategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExpenseCategoryFilter({
  value,
  onChange,
}: ExpenseCategoryFilterProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ maxWidth: 200 }}>
      <InputLabel>Category</InputLabel>
      <Select value={value} label="Category" onChange={handleChange}>
        <MenuItem value="all">All Categories</MenuItem>
        <MenuItem value="Accommodation">Accommodation</MenuItem>
        <MenuItem value="Transport">Transport</MenuItem>
        <MenuItem value="Food">Food & Dining</MenuItem>
        <MenuItem value="Shop">Shopping</MenuItem>
        <MenuItem value="Attraction">Attractions</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>
    </FormControl>
  );
}
