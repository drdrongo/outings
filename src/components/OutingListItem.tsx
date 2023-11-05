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
import { Outing } from '@/providers/OutingsProvider';

interface Props {
  row: Outing;
  deleteRow: () => void;
}

const OutingListItem = ({ row, deleteRow }: Props) => {
  const [open, setOpen] = useState(false);

  const expandItem = () => {
    setOpen((prev) => !prev);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${row.name}?`) == true) {
      deleteRow();
    }
  };

  const handleComplete = () => {
    if (confirm(`Mark ${row.name} as completed?`) == true) {
      deleteRow();
    }
  };

  return (
    <li className={styles.listItem} onClick={expandItem}>
      <div className={styles.rowContent}>
        <h3>
          <span>{row.name}</span>
          <ChevronRightIcon
            className={clsx([styles.chevron, open && styles.chevronOpen])}
          />
        </h3>
        {row.description.length > 0 && (
          <p className={styles.description}>{row.description}</p>
        )}
        {row.tags?.length > 0 && (
          <div className={styles.tagBox}>
            {row.tags.map(({ id }) => {
              const color = stringToColor(id);
              return (
                <span
                  key={id}
                  className={styles.tag}
                  style={{ borderColor: color, color }}
                >
                  {id}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(styles.details, open ? styles.expanded : undefined)}
      >
        <Link
          className={clsx([styles.detailsButton, styles.navigate])}
          href={`outings/${row.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <OpenInNewIcon className={styles.detailsIcon} />
        </Link>

        {row.mapUrl.length > 0 && (
          <a
            href={row.mapUrl}
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
