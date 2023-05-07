import NewOuting from '@/pages/outings/new';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { Modal } from '@mui/material';
import styles from './NewOutingModal.module.css';

const NewOutingModal = () => {
  const { modalOpen, toggleModal } = useOutingsContext();

  return (
    <Modal open={modalOpen} onClose={toggleModal}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h3>New Outing</h3>
        </header>
        <NewOuting />
      </div>
    </Modal>
  );
};

export default NewOutingModal;
