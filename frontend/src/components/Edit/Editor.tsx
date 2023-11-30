import { useRef } from 'react';
import { Editor as DiaryEditor } from '@toast-ui/react-editor';

interface EditorProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const Editor = ({ content, setContent }: EditorProps) => {
  const editorRef = useRef<DiaryEditor>(null);
  const onChangeContent = () => {
    setContent(editorRef.current?.getInstance().getHTML());
  };

  const onUploadImage = () => {
    console.log('이미지 업로드');
  };

  return (
    <div className="w-4/5">
      <div className="mb-6">
        <DiaryEditor
          ref={editorRef}
          height="30rem"
          initialEditType="wysiwyg"
          placeholder="일기를 입력하세요!"
          hideModeSwitch={true}
          initialValue={content}
          onChange={onChangeContent}
          hooks={{
            addImageBlobHook: onUploadImage,
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
