import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { useState } from 'react';
import styles from './OutingListItem.module.css';
import clsx from 'clsx';
import { Delete } from '@mui/icons-material';
import { stringToColor } from '@/utils/color';
import Link from 'next/link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Props {
  row: GoogleSpreadsheetRow;
  open: boolean;
  setOpen: (num: number | null) => void;
  deleteRow: () => void;
  idx?: number;
}

const OutingListItem = ({ row, deleteRow, idx }: Props) => {
  console.log(row);
  const [open, setOpen] = useState(false);
  const expandItem = () => {
    setOpen(prev => !prev);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${row.title}?`) == true) {
      deleteRow();
    }
  };

  const handleComplete = () => {
    if (confirm(`Mark ${row.title} as complete?`) == true) {
      deleteRow();
    }
  };

  return (
    <li key={row._rowNumber} className={styles.listItem} onClick={expandItem}>
      <div className={styles.rowContent}>
        <h3>{row.title}</h3>
        <p className={styles.description}>{row.description}</p>

        {row.tags && (
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
        )}
      </div>

      <div onClick={e => e.stopPropagation()} className={clsx(styles.details, open ? styles.expanded : undefined)}>
        <Link className={styles.navigate} href={`outings/${row._rowNumber}`} onClick={e => e.stopPropagation()}>
          <OpenInNewIcon className={styles.detailsIcon} />
        </Link>

        <button className={styles.complete} onClick={handleComplete}>
          <CheckCircleOutlineIcon className={styles.detailsIcon} />
        </button>

        <button className={styles.delete} onClick={handleDelete}>
          <Delete className={styles.detailsIcon} />
        </button>
      </div>
    </li>
  );
};

export default OutingListItem;
