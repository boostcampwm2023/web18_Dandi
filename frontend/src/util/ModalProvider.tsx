import { createContext, useState } from 'react';

interface ModalData {
  children?: React.ReactNode;
}

export const ModalContext = createContext<{
  isOpen: boolean;
  openModal: (modalData: ModalData) => unknown;
  closeModal: () => unknown;
  modalData: ModalData;
}>({} as any);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({});

  const openModal = ({ children }: ModalData) => {
    setIsOpen(true);
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
    setModalData({ children });
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData({});
    const scrollY = document.body.style.top;
    document.body.style.cssText = '';
    window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
  };
  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, modalData }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
