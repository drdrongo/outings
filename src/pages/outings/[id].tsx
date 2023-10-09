import { useRouter } from 'next/router';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { useEffect, useMemo } from 'react';
import styles from '@/styles/EditOuting.module.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '@/providers/AlertProvider';
import OutingForm, { Inputs } from '@/components/OutingForm';
import { GoogleSpreadsheetRow } from 'google-spreadsheet';

type OutingDetails = { title: string; description?: string; mapUrl?: string; tags?: string };

const EditOuting = () => {
  const router = useRouter();

  const { id } = router.query;

  const { addAlert } = useAlertContext();
  const { updateOuting, allTags, getOuting } = useOutingsContext();

  const getOutingValues = (ot: GoogleSpreadsheetRow | undefined) => {
    if (!ot) return { title: '' };

    const { title, description, mapUrl, tags } = ot as GoogleSpreadsheetRow & OutingDetails;
    return {
      title,
      description,
      mapUrl,
      tags,
    };
  };

  const outing: OutingDetails = getOutingValues(getOuting(Number(id)));

  const tagsForAutocomplete = useMemo(() => allTags.map(tag => ({ title: tag })), [allTags]);

  const form = useForm<Inputs>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const isOkay = await updateOuting(Number(id), data);
    if (!isOkay) {
      addAlert({ severity: 'error', label: 'Failed to Update Outing' });
      return;
    } else {
      addAlert({ severity: 'success', label: 'Outing Updated' });
    }

    // Navigate back to list
    router.push('/outings');
  };

  useEffect(() => {
    form.reset(outing, { keepDefaultValues: true });
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>Edit Outing</h3>
      </header>

      <OutingForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        tagsForAutocomplete={tagsForAutocomplete}
        forEdit={true}
      />
    </main>
  );
};

export default EditOuting;
