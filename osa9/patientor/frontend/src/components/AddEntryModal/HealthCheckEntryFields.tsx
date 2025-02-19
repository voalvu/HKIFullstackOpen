import { SelectChangeEvent, InputLabel, Select, MenuItem } from "@mui/material";
import { HealthCheckRating, RatingOption } from "../../../../shared/types/types";

interface Props{
    rating:HealthCheckRating;
    setRating: React.Dispatch<React.SetStateAction<HealthCheckRating>>;
}

const HealthCheckEntryFields = ({rating,setRating}:Props) =>{

    const ratingOptions: RatingOption[] = Object.keys(HealthCheckRating)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
        value: HealthCheckRating[key as keyof typeof HealthCheckRating].toString()
    }));

    

      const onRatingChange = (event: SelectChangeEvent<HealthCheckRating>) => {
        event.preventDefault();
        if (typeof event.target.value === "string") {
          const value = event.target.value;
          const rating = Object.values(HealthCheckRating).find(r => r.toString() === value);
          if (rating) {
            setRating(rating as HealthCheckRating);
          }
        }
      };
return(
    
          <div>
            <InputLabel style={{ marginTop: 20 }}>Rating</InputLabel>
            <Select
              label="rating"
              fullWidth
              value={rating}
              onChange={onRatingChange}
            >
              {ratingOptions.map(option => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </div>
);
};

export default HealthCheckEntryFields;