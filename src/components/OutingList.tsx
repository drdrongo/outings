import styles from './OutingList.module.css';
import OutingListItem, { GoogleSpreadsheetRowDetailed } from './OutingListItem';
import { useState } from 'react';
import { useOutingsContext } from '@/providers/OutingsProvider';

const OutingList = ({ rows }: { rows: GoogleSpreadsheetRowDetailed[] }) => {
  const { deleteOuting } = useOutingsContext();
  const [openRowNumber, setOpenRowNumber] = useState<number | null>(null);

  return (
    <ul className={styles.list}>
      {rows.map((row, idx) => {
        return (
          <OutingListItem
            key={row._rowNumber}
            idx={idx}
            row={row}
            open={+row._rowNumber === openRowNumber}
            setOpen={(num: number | null) => setOpenRowNumber(num)}
            deleteRow={() => deleteOuting(row._rowNumber)}
          />
        );
      })}
    </ul>
  );
};

export default OutingList;
