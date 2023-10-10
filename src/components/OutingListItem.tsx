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
import { OutingsRowData } from '@/types/outings';

interface Props {
  row: GoogleSpreadsheetRow<OutingsRowData>;
  deleteRow: () => void;
}

const OutingListItem = ({ row, deleteRow }: Props) => {
  const [open, setOpen] = useState(false);
  const expandItem = () => {
    setOpen(prev => !prev);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${row.get('title')}?`) == true) {
      deleteRow();
    }
  };

  const handleComplete = () => {
    if (confirm(`Mark ${row.get('title')} as complete?`) == true) {
      deleteRow();
    }
  };

  return (
    <li key={row.get('uuid')} className={styles.listItem} onClick={expandItem}>
      <div className={styles.rowContent}>
        <h3>
          <span>{row.get('title')}</span>
          <ChevronRightIcon
            className={clsx([styles.chevron, open && styles.chevronOpen])}
          />
        </h3>
        <p className={styles.description}>{row.get('description')}</p>
        {row.get('tags') && (
          <div className={styles.tagBox}>
            {row
              .get('tags')
              ?.split('|')
              ?.map((tag: string) => {
                const color = stringToColor(tag);
                return (
                  <span
                    key={tag}
                    className={styles.tag}
                    style={{ borderColor: color, color }}
                  >
                    {tag}
                  </span>
                );
              })}
          </div>
        )}
      </div>

      <div
        onClick={e => e.stopPropagation()}
        className={clsx(styles.details, open ? styles.expanded : undefined)}
      >
        <Link
          className={clsx([styles.detailsButton, styles.navigate])}
          href={`outings/${row.get('uuid')}`}
          onClick={e => e.stopPropagation()}
        >
          <OpenInNewIcon className={styles.detailsIcon} />
        </Link>

        {row.get('mapUrl') && (
          <a
            href={row.get('mapUrl')}
            target="_blank"
            className={clsx([styles.detailsButton, styles.mapUrl])}
          >
            <PlaceIcon className={styles.detailsIcon} />
          </a>
        )}

        <button
          className={clsx([styles.detailsButton, styles.complete])}
          onClick={handleComplete}
        >
          <CheckCircleOutlineIcon className={styles.detailsIcon} />
        </button>

        <button
          className={clsx([styles.detailsButton, styles.delete])}
          onClick={handleDelete}
        >
          <Delete className={styles.detailsIcon} />
        </button>
      </div>
    </li>
  );
};

export default OutingListItem;
