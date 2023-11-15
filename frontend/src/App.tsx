import './globals.css';
import Modal from './components/Common/Modal';
import Alert from './components/Common/Alert';

function App() {
  return (
    <Modal>
      <Alert text="삭제하시겠습니까?" />
    </Modal>
  );
}

export default App;
