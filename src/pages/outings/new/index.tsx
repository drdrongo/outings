import { useEffect, type ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import styles from './styles.module.css';
import { useOutingsContext } from '@/providers/OutingsProvider';
import Layout from '@/components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import OutingForm, { Inputs } from '@/components/OutingForm';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/providers/AuthProvider';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { useAlertContext } from '@/providers/AlertProvider';

const NewOuting: NextPageWithLayout = () => {
  const { addOuting, allTags } = useOutingsContext();
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const { addAlert, getOutingAlertMsg } = useAlertContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const form = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      mapUrl: '',
      tags: [],
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { continueAdding } = data;
    delete data.continueAdding;
    startLoading();
    const addSuccess = await addOuting({ ...data, deleted: false, completed: false });
    stopLoading();
    addAlert(getOutingAlertMsg(!!addSuccess, 'add'));

    if (continueAdding) {
      form.reset(); // Stay on form
    } else {
      router.push('/outings'); // Navigate back to list
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>New Outing</h3>
      </header>
      <section className={styles.formSection}>
        <OutingForm
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          tags={allTags}
          forEdit={false}
        />
      </section>
    </main>
  );
};

NewOuting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewOuting;
