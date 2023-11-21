import { Editor as DiaryEditor } from '@toast-ui/react-editor';
import { useRef } from 'react';

const Editor = () => {
  const editorRef = useRef<DiaryEditor>(null);

  const onChangeContent = () => {
    console.log(editorRef.current?.getInstance().getHTML());
  };

  const onUploadImage = () => {
    console.log('이미지 업로드');
  };

  return (
    <div className="w-[80%]">
      <div className="mb-6">
        <DiaryEditor
          ref={editorRef}
          height="30rem"
          initialEditType="wysiwyg"
          placeholder="일기를 입력하세요!"
          hideModeSwitch={true}
          initialValue=" "
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
