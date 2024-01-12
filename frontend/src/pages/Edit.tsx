import NavBar from '@components/Common/NavBar';
import Header from '@components/Edit/Header';
import Editor from '@components/Edit/Editor';
import KeywordBox from '@components/Edit/KeywordBox';

const Edit = () => {
  return (
    <div className="flex flex-col items-center justify-start">
      <NavBar />
      <Header />
      <Editor />
      <KeywordBox />
    </div>
  );
};

export default Edit;
