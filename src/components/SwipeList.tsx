import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import styles from './SwipeList.module.css';
import SwipeListItem from './SwipeListItem';
import { useState } from 'react';
import { useOutingsContext } from '@/providers/OutingsProvider';

const SwipeList = ({ rows }: { rows: GoogleSpreadsheetRow[] }) => {
  const { deleteOuting } = useOutingsContext();
  const [openRowNumber, setOpenRowNumber] = useState<number | null>(null);

  return (
    <ul className={styles.list}>
      {rows.map((row, idx) => {
        return (
          <SwipeListItem
            key={row._rowNumber}
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

export default SwipeList;
