import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { useState } from 'react';
import styles from './SwipeListItem.module.css';
import clsx from 'clsx';
import { Delete } from '@mui/icons-material';

interface Props {
  row: GoogleSpreadsheetRow;
  open: boolean;
  setOpen: (num: number | null) => void;
  deleteRow: () => void;
}

const SwipeListItem = ({ row, open, setOpen, deleteRow }: Props) => {
  const [touchPosition, setTouchPosition] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLLIElement>) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLLIElement>) => {
    const touchDown = touchPosition;
    if (!touchDown) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) setOpen(row._rowNumber);
    if (diff < -5) setOpen(null);

    setTouchPosition(null);
  };

  return (
    <li
      key={row._rowNumber}
      className={styles.listItem}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className={clsx(styles.draggable, open && styles.open)}>
        <div className={styles.rowContent}>
          <h3>
            #{row._rowNumber} - {row.title}
          </h3>
          <p className={styles.description}>{row.description}</p>
        </div>
        <div className={styles.underlay}>
          <button className={styles.delete} onClick={deleteRow}>
            <Delete />
          </button>
        </div>
      </div>
    </li>
  );
};

export default SwipeListItem;
