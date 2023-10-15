import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import styles from './styles.module.css';
import { useOutingsContext } from '@/providers/OutingsProvider';
import Layout from '@/components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import OutingForm, { Inputs } from '@/components/OutingForm';
import { useRouter } from 'next/router';

const NewOuting: NextPageWithLayout = () => {
  const { addOuting, allTags } = useOutingsContext();
  const router = useRouter();
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
    await addOuting({ ...data, deleted: false, completed: false });
    if (continueAdding) {
      form.reset(); // Stay on form
    } else {
      router.push('/outings'); // Navigate back to list
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
