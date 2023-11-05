import { useEffect, ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import styles from './styles.module.css';
import type { NextPageWithLayout } from '@/pages/_app';
import { Outing, useOutingsContext } from '@/providers/OutingsProvider';
import OutingForm, { Inputs } from '@/components/OutingForm';
import Layout from '@/components/Layout';
import { useAuthContext } from '@/providers/AuthProvider';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { useAlertContext } from '@/providers/AlertProvider';

const EditOuting: NextPageWithLayout = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const { id } = router.query;
  const { updateOuting, allTags, getOuting } = useOutingsContext();
  const [outing, setOuting] = useState<Outing | null>(null);
  const { addAlert, getOutingAlertMsg } = useAlertContext();

  const { startLoading, stopLoading } = useLoadingContext();

  const form = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      name: outing?.name || '',
      description: outing?.description || '',
      mapUrl: outing?.mapUrl || '',
      tags: outing?.tags?.map(({ id }) => id) || [],
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!outing || !outing.id) {
      console.error('Error while updating');
      return;
    }

    startLoading();
    const saveSuccess = await updateOuting({
      ...data,
      id: outing.id,
      deleted: false,
      completed: false,
    });
    stopLoading();
    addAlert(getOutingAlertMsg(!!saveSuccess, 'upd'));

    if (saveSuccess) {
      router.push('/outings'); // Navigate back to list
    }
  };

  useEffect(() => {
    form.reset(
      {
        name: outing?.name || '',
        description: outing?.description || '',
        mapUrl: outing?.mapUrl || '',
        tags: outing?.tags?.map(({ id }) => id) || [],
      },
      { keepDefaultValues: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outing]);

  useEffect(() => {
    (async () => {
      if (!id || Array.isArray(id)) {
        return;
      }

      const fetchedOuting = await getOuting(id);
      setOuting(fetchedOuting);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>Edit Outing</h3>
      </header>

      <section className={styles.formSection}>
        <OutingForm
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          tags={allTags}
          forEdit={true}
        />
      </section>
    </main>
  );
};

EditOuting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EditOuting;
