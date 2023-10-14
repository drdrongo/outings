import { useEffect, useMemo, ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import styles from '@/styles/EditOuting.module.css';
import type { NextPageWithLayout } from '@/pages/_app';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { useAlertContext } from '@/providers/AlertProvider';
import OutingForm, { Inputs } from '@/components/OutingForm';
import Layout from '@/components/Layout';

const EditOuting: NextPageWithLayout = () => {
  const router = useRouter();

  const { id } = router.query;

  const { addAlert } = useAlertContext();
  const { updateOuting, allTags, getOuting } = useOutingsContext();

  const outing = useMemo(() => {
    if (!id || Array.isArray(id)) {
      return undefined;
    }

    return getOuting(id);
  }, [id, getOuting]);

  const form = useForm<Inputs>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (!outing) {
      console.error('Error while updating');
      return;
    }

    const isOkay = await updateOuting(outing.get('uuid'), data);
    if (!isOkay) {
      addAlert({ severity: 'error', label: 'Failed to Update Outing' });
    } else {
      addAlert({ severity: 'success', label: 'Outing Updated' });
      // Navigate back to list
      router.push('/outings');
    }
  };

  useEffect(() => {
    form.reset(
      {
        title: outing?.get('title'),
        description: outing?.get('description'),
        mapUrl: outing?.get('mapUrl'),
        tags: outing?.get('tags'),
      },
      { keepDefaultValues: true }
    );
  }, [outing]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>Edit Outing</h3>
      </header>

      <OutingForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        tags={allTags}
        forEdit={true}
      />
    </main>
  );
};

EditOuting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EditOuting;
