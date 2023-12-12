import { useContext } from 'react';

import { ModalContext } from '@util/ModalProvider';

const useModal = () => useContext(ModalContext);

export default useModal;
