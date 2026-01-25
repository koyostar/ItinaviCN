import { Stack, TextField, Typography } from "@mui/material";

interface FoodDetails {
  title: string;
  cuisine: string;
  reservationInfo: string;
}

interface FoodFieldsProps {
  foodDetails: FoodDetails;
  onFoodDetailsChange: (details: FoodDetails) => void;
}

export function FoodFields({
  foodDetails,
  onFoodDetailsChange,
}: FoodFieldsProps) {
  return (
    <>
      <TextField
        label="Title"
        required
        fullWidth
        value={foodDetails.title}
        onChange={(e) =>
          onFoodDetailsChange({
            ...foodDetails,
            title: e.target.value,
          })
        }
        placeholder="e.g., Dinner at Dadong"
      />
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="primary">
          Food Details
        </Typography>
        <TextField
          label="Cuisine"
          fullWidth
          value={foodDetails.cuisine}
          onChange={(e) =>
            onFoodDetailsChange({
              ...foodDetails,
              cuisine: e.target.value,
            })
          }
          placeholder="e.g., Peking Duck, Sichuan"
        />
        <TextField
          label="Reservation Info"
          fullWidth
          value={foodDetails.reservationInfo}
          onChange={(e) =>
            onFoodDetailsChange({
              ...foodDetails,
              reservationInfo: e.target.value,
            })
          }
          placeholder="e.g., Reserved for 7 PM, Table 12"
        />
      </Stack>
    </>
  );
}
