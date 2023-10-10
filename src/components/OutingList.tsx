import styles from './OutingList.module.css';
import OutingListItem from './OutingListItem';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { OutingsRowData } from '@/types/outings';

const OutingList = ({ rows }: { rows: GoogleSpreadsheetRow<OutingsRowData>[] }) => {
  const { deleteOuting } = useOutingsContext();

  return (
    <ul className={styles.list}>
      {rows.map((row, idx) => {
        return (
          <OutingListItem
            key={row.get('uuid')}
            row={row}
            deleteRow={() => deleteOuting(row.get('uuid'))}
          />
        );
      })}
    </ul>
  );
};

export default OutingList;
