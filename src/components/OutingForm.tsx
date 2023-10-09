import { Autocomplete, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import styles from './OutingForm.module.css';
import { Save } from '@mui/icons-material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { stringToColor } from '@/utils/color';
import { BaseSyntheticEvent } from 'react';

type Inputs = {
  title: string;
  description: string;
  tags: string;
  continueAdding?: boolean;
};

type Props = {
  form: UseFormReturn<Inputs, any>;
  tagsForAutocomplete: {
    title: string;
  }[];
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
};

const OutingForm = ({ onSubmit, form, tagsForAutocomplete }: Props) => {
  const {
    control,
    formState: { isValid },
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
            placeholder="Outing Title"
            className={styles.formItem}
            inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
            variant="outlined"
            label={<Typography className={styles.label}>Title</Typography>}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextField
            id="description"
            value={value || ''} // add a default empty string if value is undefined
            onChange={onChange}
            placeholder="Outing Description"
            multiline
            className={styles.formItem}
            minRows={5}
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
            onOpen={e =>
              setTimeout(() => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' }), 100)
            }
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
                <span {...props} className={styles.autocompleteItem}>
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

      <Button
        variant="contained"
        size="large"
        type="submit"
        className={styles.save}
        startIcon={<Save />}
        color="primary"
        disabled={!isValid}
      >
        Create
      </Button>
    </form>
  );
};
export default OutingForm;
