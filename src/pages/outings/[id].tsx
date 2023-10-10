import { useRouter } from 'next/router';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { useEffect, useMemo } from 'react';
import styles from '@/styles/EditOuting.module.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '@/providers/AlertProvider';
import OutingForm, { Inputs } from '@/components/OutingForm';

const EditOuting = () => {
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

export default EditOuting;
