import { useNavigate } from 'react-router-dom';
import { viewTypes } from '@type/pages/MyDiary';
import useViewTypeStore from '@store/useViewTypeStore';
import { DIARY_VIEW_TYPE_LIST, PAGE_URL } from '@util/constants';

const ViewType = () => {
  const { viewType, setViewType } = useViewTypeStore();
  const navigate = useNavigate();

  const handleViewTypeChange = (type: viewTypes) => {
    setViewType(type);
    navigate(`${PAGE_URL.MY_DIARY}`, {
      state: {
        viewType: type,
      },
    });
  };

  return (
    <section className="flex justify-end gap-2 pr-5 sm:justify-center sm:pr-0">
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
