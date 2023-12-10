import { viewTypes } from '@type/pages/MyDiary';

import { DIARY_VIEW_TYPE_LIST } from '@util/constants';

interface ViewTypeProp {
  viewType: viewTypes;
  handleViewTypeChange: (type: viewTypes) => void;
}

const ViewType = ({ viewType, handleViewTypeChange }: ViewTypeProp) => {
  return (
    <section className="flex gap-2">
      {DIARY_VIEW_TYPE_LIST.map((type, index) => (
        <button
          key={index}
          onClick={() => handleViewTypeChange(type)}
          className={`${
            viewType === type ? 'bg-mint text-white' : 'text-default bg-white '
          } border-mint rounded-xl border px-4 py-2.5 text-lg font-bold`}
        >
          {type}
        </button>
      ))}
    </section>
  );
};

export default ViewType;
