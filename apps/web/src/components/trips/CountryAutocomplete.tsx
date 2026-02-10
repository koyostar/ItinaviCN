import { Autocomplete, TextField } from "@mui/material";
import { COUNTRIES, findLocationKey, getDisplayName } from "@itinavi/schema";

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  language: "en" | "zh";
}

export function CountryAutocomplete({
  value,
  onChange,
  language,
}: CountryAutocompleteProps) {
  return (
    <Autocomplete
      fullWidth
      options={Object.keys(COUNTRIES)}
      value={value}
      inputValue={
        value
          ? COUNTRIES[value]
            ? getDisplayName(COUNTRIES[value], language)
            : value
          : ""
      }
      onInputChange={(_, newInputValue, reason) => {
        if (reason === "input") {
          onChange(newInputValue);
        } else if (reason === "clear") {
          onChange("");
        }
      }}
      onChange={(_, newValue) => {
        const standardized = newValue
          ? findLocationKey(newValue, COUNTRIES) || newValue
          : "";
        onChange(standardized);
      }}
      filterOptions={(options, state) => {
        const inputValue = state.inputValue.toLowerCase();
        return options.filter((option) => {
          const countryData = COUNTRIES[option];
          return (
            option.toLowerCase().includes(inputValue) ||
            countryData.en.toLowerCase().includes(inputValue) ||
            countryData.zh.includes(state.inputValue)
          );
        });
      }}
      getOptionLabel={(option) => {
        const countryData = COUNTRIES[option];
        return countryData ? getDisplayName(countryData, language) : option;
      }}
      renderInput={(params) => (
        <TextField {...params} label="Country" placeholder="Search country..." />
      )}
      renderOption={(props, option) => {
        const countryData = COUNTRIES[option];
        return (
          <li {...props} key={option}>
            {countryData ? `${countryData.zh} / ${countryData.en}` : option}
          </li>
        );
      }}
    />
  );
}
