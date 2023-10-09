import { Autocomplete, Button, Checkbox, FormControlLabel, IconButton, TextField, Typography } from '@mui/material';
import styles from './OutingForm.module.css';
import { Cancel, Save } from '@mui/icons-material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { stringToColor } from '@/utils/color';
import { BaseSyntheticEvent } from 'react';
import { urlRegex } from '@/utils/regex';

export type Inputs = {
  title: string;
  description: string;
  mapUrl: string;
  tags: string;
  continueAdding?: boolean;
};

type Props = {
  form: UseFormReturn<Inputs, any>;
  tagsForAutocomplete: {
    title: string;
  }[];
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  forEdit: boolean;
};

const OutingForm = ({ onSubmit, form, tagsForAutocomplete, forEdit }: Props) => {
  const {
    control,
    formState: { isValid },
    resetField,
  } = form;

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="title"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextField
            id="title"
            value={value || ''} // add a default empty string if value is undefined
            onChange={onChange}
            placeholder="Title (required)"
            className={styles.formItem}
            inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
            variant="outlined"
            label={<Typography className={styles.label}>Title (required)</Typography>}
            InputProps={{
              endAdornment: (
                <IconButton sx={{ visibility: value ? 'visible' : 'hidden' }} onClick={() => resetField('title')}>
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
                <IconButton sx={{ visibility: value ? 'visible' : 'hidden' }} onClick={() => resetField('mapUrl')}>
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
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            freeSolo
            multiple
            id="tags"
            options={tagsForAutocomplete}
            // Workaround to avoid hiding by ios keyboard
            onOpen={e => setTimeout(() => (e.target as HTMLElement).scrollIntoView({ block: 'end' }), 200)}
            value={value?.split('|') || []}
            onChange={(_, data) => {
              onChange(data.map(item => (typeof item === 'string' ? item : item.title)).join('|'));
            }}
            getOptionLabel={option => (typeof option === 'string' ? option : option.title)}
            filterSelectedOptions
            renderInput={params => <TextField {...params} placeholder="Choose a tag" />}
            // Change style & color of each selectable option
            renderOption={(props, option) => {
              const { title } = option;
              const color = stringToColor(title);
              return (
                <span style={{ backgroundColor: 'var(--clr-background' }} {...props}>
                  <span className={styles.autocompleteItemInner} style={{ borderColor: color, color }}>
                    {title}
                  </span>
                </span>
              );
            }}
            // Autocomplete list had visible white background
            ListboxProps={{ sx: { backgroundColor: 'var(--clr-background)', paddingY: 0 } }}
          />
        )}
      />

      {!forEdit && (
        <Controller
          name="continueAdding"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              control={<Checkbox onChange={onChange} checked={!!value} style={{ transform: 'scale(1.4)' }} />}
              label={<Typography className={styles.label}>Continue Creating Outings</Typography>}
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
