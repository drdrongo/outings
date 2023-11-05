import { useMemo } from 'react';
import styles from './OutingList.module.css';
import OutingListItem from './OutingListItem';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { useAlertContext } from '@/providers/AlertProvider';
import { useLoadingContext } from '@/providers/LoadingProvider';

const OutingList = () => {
  const { outings, deleteOuting } = useOutingsContext();
  const { addAlert, getOutingAlertMsg } = useAlertContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const handleDelete = async (outingId: string) => {
    startLoading();
    const delSuccess = await deleteOuting(outingId);
    addAlert(getOutingAlertMsg(delSuccess, 'del'));
    stopLoading();
  };

  const rows = useMemo(() => outings.filter(({ deleted }) => !deleted), [outings]);

  if (rows.length === 0) {
    return (
      <div className={styles.noOutings}>
        <p>You have no planned outings</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {rows.map((row, idx) => {
        return (
          <OutingListItem
            key={row.id}
            row={row}
            deleteRow={() => handleDelete(row.id as string)}
          />
        );
      })}
    </ul>
  );
};

export default OutingList;
