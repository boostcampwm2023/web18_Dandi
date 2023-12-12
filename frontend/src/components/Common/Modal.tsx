import { createPortal } from 'react-dom';

import Icon from '@components/Common/Icon';

import useModal from '@/hooks/useModal';

const Modal = () => {
  const { isOpen, modalData, closeModal } = useModal();

  if (!isOpen) {
    return <></>;
  }

  const { children } = modalData;

  return createPortal(
    <>
      <div
        className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white bg-opacity-80"
        onClick={closeModal}
      >
        <div className="border-default relative h-auto max-h-[75%] w-1/3 min-w-[90%] overflow-hidden rounded-2xl border bg-white p-4 pb-5 shadow-[0_0_20px_0_rgba(0,0,0,0.25)] sm:min-w-min">
          <button onClick={closeModal}>
            <Icon id="closed" styles="absolute right-4 top-3 h-6 w-6" />
          </button>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('modal') as HTMLElement,
  );
};

export default Modal;
