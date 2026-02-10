import { Autocomplete, TextField } from "@mui/material";
import { CITIES, findLocationKey, getDisplayName } from "@itinavi/schema";

interface CityAutocompleteProps {
  country: string;
  value: string;
  onChange: (value: string) => void;
  language: "en" | "zh";
}

export function CityAutocomplete({
  country,
  value,
  onChange,
  language,
}: CityAutocompleteProps) {
  const countryCities = country && CITIES[country] ? CITIES[country] : {};

  return (
    <Autocomplete
      size="small"
      fullWidth
      options={Object.keys(countryCities)}
      value={value}
      inputValue={
        value
          ? countryCities[value]
            ? getDisplayName(countryCities[value], language)
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
          ? findLocationKey(newValue, countryCities) || newValue
          : "";
        onChange(standardized);
      }}
      filterOptions={(options, state) => {
        const inputValue = state.inputValue.toLowerCase();
        return options.filter((option) => {
          const cityData = countryCities[option];
          return (
            option.toLowerCase().includes(inputValue) ||
            cityData.en.toLowerCase().includes(inputValue) ||
            cityData.zh.includes(state.inputValue)
          );
        });
      }}
      getOptionLabel={(option) => {
        const cityData = countryCities[option];
        return cityData ? getDisplayName(cityData, language) : option;
      }}
      renderInput={(params) => (
        <TextField {...params} size="small" placeholder="Search city..." />
      )}
      renderOption={(props, option) => {
        const cityData = countryCities[option];
        return (
          <li {...props} key={option}>
            {cityData ? `${cityData.zh} / ${cityData.en}` : option}
          </li>
        );
      }}
    />
  );
}
