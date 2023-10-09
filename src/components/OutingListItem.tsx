import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { useState } from 'react';
import styles from './OutingListItem.module.css';
import clsx from 'clsx';
import { Delete } from '@mui/icons-material';
import { stringToColor } from '@/utils/color';
import Link from 'next/link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlaceIcon from '@mui/icons-material/Place';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type GoogleSpreadsheetRowDetailed = GoogleSpreadsheetRow & {
  title: string;
  description?: string;
  tags?: string;
  mapUrl?: string;
  _rowNumber: number;
};

interface Props {
  row: GoogleSpreadsheetRowDetailed;
  open: boolean;
  setOpen: (num: number | null) => void;
  deleteRow: () => void;
  idx?: number;
}

const OutingListItem = ({ row, deleteRow, idx }: Props) => {
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
        <h3>
          <span>{row.title}</span>
          <ChevronRightIcon className={clsx([styles.chevron, open && styles.chevronOpen])} />
        </h3>
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
        <Link
          className={clsx([styles.detailsButton, styles.navigate])}
          href={`outings/${row._rowNumber}`}
          onClick={e => e.stopPropagation()}
        >
          <OpenInNewIcon className={styles.detailsIcon} />
        </Link>

        {row.mapUrl && (
          <a href={row.mapUrl} target="_blank" className={clsx([styles.detailsButton, styles.mapUrl])}>
            <PlaceIcon className={styles.detailsIcon} />
          </a>
        )}

        <button className={clsx([styles.detailsButton, styles.complete])} onClick={handleComplete}>
          <CheckCircleOutlineIcon className={styles.detailsIcon} />
        </button>

        <button className={clsx([styles.detailsButton, styles.delete])} onClick={handleDelete}>
          <Delete className={styles.detailsIcon} />
        </button>
      </div>
    </li>
  );
};

export default OutingListItem;
