import { ReactNode, useState, useEffect } from 'react';

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
      <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-[##ffffff80] bg-opacity-80">
        <div className="border-default relative h-80 w-1/3 rounded-2xl border bg-[#fff] p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.25)]">
          <svg
            className="absolute right-4 top-3 h-6 w-6"
            onClick={handleClose}
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M20.3604 18.7022C20.5805 18.9224 20.7042 19.221 20.7042 19.5323C20.7042 19.8436 20.5805 20.1422 20.3604 20.3624C20.1402 20.5825 19.8416 20.7062 19.5303 20.7062C19.219 20.7062 18.9204 20.5825 18.7002 20.3624L12.5 14.1602L6.29787 20.3604C6.07772 20.5806 5.77913 20.7043 5.46779 20.7043C5.15645 20.7043 4.85786 20.5806 4.63771 20.3604C4.41756 20.1403 4.29388 19.8417 4.29388 19.5304C4.29388 19.219 4.41756 18.9204 4.63771 18.7003L10.8399 12.5001L4.63967 6.29793C4.41952 6.07778 4.29584 5.77919 4.29584 5.46785C4.29584 5.15651 4.41952 4.85793 4.63967 4.63777C4.85982 4.41762 5.15841 4.29395 5.46974 4.29395C5.78108 4.29395 6.07967 4.41762 6.29982 4.63777L12.5 10.8399L18.7022 4.6368C18.9223 4.41665 19.2209 4.29297 19.5322 4.29297C19.8436 4.29297 20.1422 4.41665 20.3623 4.6368C20.5825 4.85695 20.7062 5.15554 20.7062 5.46688C20.7062 5.77822 20.5825 6.0768 20.3623 6.29695L14.1602 12.5001L20.3604 18.7022Z"
              fill="#4B4B4B"
            />
          </svg>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
