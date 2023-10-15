import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import styles from './OutingForm.module.css';
import { Cancel, Save } from '@mui/icons-material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { stringToColor } from '@/utils/color';
import { BaseSyntheticEvent } from 'react';
import { urlRegex } from '@/utils/regex';

export type Inputs = {
  name: string;
  description: string;
  mapUrl: string;
  tags: string[];
  continueAdding?: boolean;
};

type Props = {
  form: UseFormReturn<Inputs, any>;
  tags: string[];
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  forEdit: boolean;
};

const OutingForm = ({ onSubmit, form, tags, forEdit }: Props) => {
  const {
    control,
    formState: { isValid },
    resetField,
  } = form;

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextField
            id="name"
            value={value || ''} // add a default empty string if value is undefined
            onChange={onChange}
            placeholder="Name (required)"
            className={styles.formItem}
            inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
            variant="outlined"
            label={<Typography className={styles.label}>Name (required)</Typography>}
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{ visibility: value ? 'visible' : 'hidden' }}
                  onClick={() => resetField('name')}
                >
                  <Cancel htmlColor="var(--clr-foreground)" />
                </IconButton>
              ),
            }}
          />
        )}
      />

      <Controller
        name="mapUrl"
        control={control}
        rules={{ pattern: urlRegex }}
        render={({ field: { onChange, value } }) => (
          <TextField
            id="mapUrl"
            value={value || ''} // add a default empty string if value is undefined
            onChange={onChange}
            placeholder="Map URL"
            type="url"
            className={styles.formItem}
            inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
            variant="outlined"
            label={<Typography className={styles.label}>Map URL</Typography>}
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{ visibility: value ? 'visible' : 'hidden' }}
                  onClick={() => resetField('mapUrl')}
                >
                  <Cancel htmlColor="var(--clr-foreground)" />
                </IconButton>
              ),
            }}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            id="description"
            value={value || ''} // add a default empty string if value is undefined
            onChange={onChange}
            placeholder="Description"
            multiline
            className={styles.formItem}
            minRows={2}
            inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
            variant="outlined"
            label={<Typography className={styles.label}>Description</Typography>}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <Autocomplete
              freeSolo
              multiple
              id="tags"
              options={tags}
              // Workaround to avoid hiding by ios keyboard
              onOpen={(e) =>
                setTimeout(
                  () => (e.target as HTMLElement).scrollIntoView({ block: 'end' }),
                  200
                )
              }
              value={value || []}
              onChange={(_, data) => {
                onChange(data);
              }}
              // getOptionLabel={(option) =>
              //   typeof option === 'string' ? option : option.title
              // }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} placeholder="Choose a tag" />
              )}
              // Change style & color of each selectable option
              renderOption={(props, option) => {
                const color = stringToColor(option);
                return (
                  <span style={{ backgroundColor: 'var(--clr-background' }} {...props}>
                    <span
                      className={styles.autocompleteItemInner}
                      style={{ borderColor: color, color }}
                    >
                      {option}
                    </span>
                  </span>
                );
              }}
              // Autocomplete list had visible white background
              ListboxProps={{
                sx: { backgroundColor: 'var(--clr-background)', paddingY: 0 },
              }}
            />
          );
        }}
      />

      {!forEdit && (
        <Controller
          name="continueAdding"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={onChange}
                  checked={!!value}
                  style={{ transform: 'scale(1.4)' }}
                />
              }
              label={
                <Typography className={styles.label}>
                  Continue Creating Outings
                </Typography>
              }
              className={styles.checkbox}
            />
          )}
        />
      )}

      <Button
        variant="contained"
        size="large"
        type="submit"
        className={styles.save}
        startIcon={<Save />}
        color="primary"
        disabled={!isValid}
      >
        {forEdit ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};
export default OutingForm;
