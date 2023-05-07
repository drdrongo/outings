import { useOutingsContext } from '@/providers/OutingsProvider';
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import styles from '@/styles/NewOuting.module.css';
import { Save } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '@/providers/AlertProvider';

type Inputs = {
  title: string;
  description: string;
  tags: string;
};

const NewOuting = () => {
  const router = useRouter();

  const [continueAdding, setContinueAdding] = useState(false);

  const toggleContinueAdding = () => setContinueAdding((prev) => !prev);

  const { addAlert } = useAlertContext();
  const { addOuting, allTags, toggleModal } = useOutingsContext();

  const tagsForAutocomplete = useMemo(
    () => allTags.map((tag) => ({ title: tag })),
    [allTags]
  );

  const { handleSubmit, control, formState, reset } = useForm<Inputs>({
    mode: 'onChange',
  });

  const { isValid } = formState;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='title'
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextField
              id='title'
              value={value || ''} // add a default empty string if value is undefined
              onChange={onChange}
              placeholder='Outing Title'
              className={styles.formItem}
              inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
              variant='outlined'
              label={
                <Typography className={styles.checkboxLabel}>Title</Typography>
              }
            />
          )}
        />

        <Controller
          name='description'
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextField
              id='description'
              value={value || ''} // add a default empty string if value is undefined
              onChange={onChange}
              placeholder='Outing Description'
              multiline
              className={styles.formItem}
              minRows={5}
              inputProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 20, lineHeight: 1.5 } }} // font size of input label
              variant='outlined'
              label={
                <Typography className={styles.checkboxLabel}>
                  Description
                </Typography>
              }
            />
          )}
        />

        <Controller
          name='tags'
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              freeSolo
              multiple
              id='tags'
              options={tagsForAutocomplete}
              // value={value} // add a default empty string if value is undefined
              onChange={(_, data) =>
                onChange(
                  data
                    .map((item) =>
                      typeof item === 'string' ? item : item.title
                    )
                    .join('|')
                )
              }
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.title
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} placeholder='Choose a tag' />
              )}
            />
          )}
        />

        <FormControlLabel
          control={
            <Checkbox
              onChange={toggleContinueAdding}
              checked={continueAdding}
              style={{ transform: 'scale(1.4)' }}
            />
          }
          label={
            <Typography className={styles.checkboxLabel}>
              Continue Creating Outings
            </Typography>
          }
          className={styles.checkbox}
        />

        <Button
          variant='contained'
          size='large'
          type='submit'
          className={styles.save}
          startIcon={<Save />}
          color='primary'
          disabled={!isValid}
        >
          Create
        </Button>
      </form>
    </main>
  );
};

export default NewOuting;
