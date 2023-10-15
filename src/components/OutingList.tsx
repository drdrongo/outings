import styles from './OutingList.module.css';
import OutingListItem from './OutingListItem';
import { Outing, useOutingsContext } from '@/providers/OutingsProvider';

const OutingList = ({ rows }: { rows: Outing[] }) => {
  const { deleteOuting } = useOutingsContext();

  return (
    <ul className={styles.list}>
      {rows.map((row, idx) => {
        return (
          <OutingListItem key={row.id} row={row} deleteRow={() => deleteOuting(row.id)} />
        );
      })}
    </ul>
  );
};

export default OutingList;
