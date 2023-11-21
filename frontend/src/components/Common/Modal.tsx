import { ReactNode, useState, useEffect } from 'react';
import Icon from './Icon';

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  children: ReactNode;
}

const Modal = ({ showModal, closeModal, children }: ModalProps) => {
  const [opened, setOpened] = useState(showModal);

  useEffect(() => {
    setOpened(showModal);
  }, [showModal]);

  const handleClose = () => {
    setOpened(false);
    closeModal();
  };

  return (
    opened && (
      <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-white bg-opacity-80">
        <div className="border-default relative w-1/3 rounded-2xl border bg-[#fff] p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.25)]">
          <button onClick={handleClose}>
            <Icon id="closed" styles="absolute right-4 top-3 h-6 w-6" />
          </button>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
