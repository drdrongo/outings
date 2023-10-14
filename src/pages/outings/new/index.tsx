import { useOutingsContext } from '@/providers/OutingsProvider';
import styles from './styles.module.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '@/providers/AlertProvider';
import { useRouter } from 'next/router';
import OutingForm, { Inputs } from '@/components/OutingForm';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import Layout from '@/components/Layout';

const NewOuting: NextPageWithLayout = () => {
  const router = useRouter();

  const { addAlert } = useAlertContext();
  const { addOuting, allTags } = useOutingsContext();

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
      // Stay on form
      form.reset();
    } else {
      // Navigate back to list
      router.push('/outings');
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>New Outing</h3>
      </header>

      <OutingForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        tags={allTags}
        forEdit={false}
      />
    </main>
  );
};

NewOuting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewOuting;
