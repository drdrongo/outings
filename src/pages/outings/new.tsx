import { useOutingsContext } from '@/providers/OutingsProvider';
import { Autocomplete, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useMemo } from 'react';
import styles from '@/styles/NewOuting.module.css';
import { Save } from '@mui/icons-material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '@/providers/AlertProvider';
import { stringToColor } from '@/utils/color';
import { useRouter } from 'next/router';
import OutingForm from '@/components/OutingForm';

type Inputs = {
  title: string;
  description: string;
  tags: string;
  continueAdding?: boolean;
};

const NewOuting = () => {
  const router = useRouter();

  const { addAlert } = useAlertContext();
  const { addOuting, allTags } = useOutingsContext();

  const tagsForAutocomplete = useMemo(() => allTags.map(tag => ({ title: tag })), [allTags]);

  const form = useForm<Inputs>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { continueAdding } = data;
    delete data.continueAdding;

    const isOkay = await addOuting(data);
    if (!isOkay) {
      addAlert({ severity: 'error', label: 'Failed to Create Outing' });
      return;
    } else {
      addAlert({ severity: 'success', label: 'Outing Created' });
    }

    if (continueAdding) {
      form.reset();
    } else {
      // Navigate away
      router.push('/outings');
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>New Outing</h3>
      </header>

      <OutingForm form={form} onSubmit={form.handleSubmit(onSubmit)} tagsForAutocomplete={tagsForAutocomplete} />
    </main>
  );
};

export default NewOuting;
