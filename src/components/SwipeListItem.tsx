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
  idx?: number;
}

const SwipeListItem = ({ row, open, setOpen, deleteRow, idx }: Props) => {
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

    if (diff > 10) setOpen(row._rowNumber);
    if (diff < -10) setOpen(null);

    setTouchPosition(null);
  };

  function stringToColor(str: string): string {
    let hue = 0;
    for (let i = 0; i < str.length; i++) {
      hue += str.charCodeAt(i);
    }
    hue %= 360;
    const saturation = '45%';
    const lightness = '65%';
    return `hsl(${hue}, ${saturation}, ${lightness})`;
  }

  return (
    <li
      key={row._rowNumber}
      className={clsx(styles.listItem, idx && idx % 2 ? styles.grey : '')}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className={clsx(styles.draggable, open && styles.open)}>
        <div className={styles.rowContent}>
          <h3>{row.title}</h3>
          <p className={styles.description}>{row.description}</p>

          <div className={styles.tagBox}>
            {row.tags?.split('|')?.map((tag: string) => {
              const color = stringToColor(tag);
              return (
                <span key={tag} className={styles.tag} style={{ borderColor: color, color }}>
                  {tag}
                </span>
              );
            })}
          </div>
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
