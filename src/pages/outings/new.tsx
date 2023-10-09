import { useOutingsContext } from '@/providers/OutingsProvider';
import { Autocomplete, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import styles from '@/styles/NewOuting.module.css';
import { Save } from '@mui/icons-material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '@/providers/AlertProvider';
import { stringToColor } from '@/utils/color';

type Inputs = {
  title: string;
  description: string;
  tags: string;
};

const NewOuting = () => {
  const [continueAdding, setContinueAdding] = useState(false);

  const { addAlert } = useAlertContext();
  const { addOuting, allTags, toggleModal } = useOutingsContext();

  const tagsForAutocomplete = useMemo(() => allTags.map(tag => ({ title: tag })), [allTags]);

  const { handleSubmit, control, formState, reset } = useForm<Inputs>({
    mode: 'onChange',
  });

  const { isValid } = formState;

  const toggleContinueAdding = () => setContinueAdding(prev => !prev);

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const isOkay = await addOuting(data);
    if (!isOkay) {
      addAlert({ severity: 'error', label: 'Failed to Create Outing' });
      return;
    } else {
      addAlert({ severity: 'success', label: 'Outing Created' });
    }

    if (continueAdding) {
      reset();
    } else {
      toggleModal();
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>New Outing</h3>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
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
              onOpen={e =>
                setTimeout(() => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' }), 100)
              }
              onChange={(_, data) =>
                onChange(data.map(item => (typeof item === 'string' ? item : item.title)).join('|'))
              }
              getOptionLabel={option => (typeof option === 'string' ? option : option.title)}
              filterSelectedOptions
              renderInput={params => <TextField {...params} placeholder="Choose a tag" />}
              // Change style & color of each selectable option
              renderOption={(props, option) => {
                const { title } = option;
                const color = stringToColor(title);
                return (
                  <span
                    {...props}
                    style={{
                      backgroundColor: 'var(--clr-background)',
                    }}
                  >
                    <span
                      style={{
                        borderColor: color,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        color,
                        padding: '0.2rem 1rem',
                        borderRadius: '2rem',
                      }}
                    >
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

        <FormControlLabel
          control={
            <Checkbox onChange={toggleContinueAdding} checked={continueAdding} style={{ transform: 'scale(1.4)' }} />
          }
          label={<Typography className={styles.label}>Continue Creating Outings</Typography>}
          className={styles.checkbox}
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
    </main>
  );
};

export default NewOuting;
