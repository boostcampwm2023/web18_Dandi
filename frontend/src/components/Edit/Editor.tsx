import { useRef } from 'react';
import { Editor as DiaryEditor } from '@toast-ui/react-editor';

import { uploadImage } from '@api/Edit';

import useEditStore from '@store/useEditStore';

const Editor = () => {
  const editorRef = useRef<DiaryEditor>(null);
  const {content, setContent, thumbnail, setThumbnail} = useEditStore();
  const onChangeContent = () => {
    setContent(editorRef.current?.getInstance().getHTML());
  };

  const onUploadImage = async (file: File, addImage: (url: string, name: string) => void) => {
    const formData = new FormData();
    formData.append('image', file);

    const url = await uploadImage(formData);
    addImage(url.imageURL, file.name);

    if (thumbnail) return;
    setThumbnail(url.imageURL);
  };

  return (
    <div className="w-full p-2 sm:w-4/5 sm:p-0">
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
