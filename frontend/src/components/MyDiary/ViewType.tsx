import { viewTypes } from '@type/pages/MyDiary';

interface ViewTypeProp {
  viewType: viewTypes;
  setViewType: React.Dispatch<React.SetStateAction<viewTypes>>;
}

const ViewType = ({ viewType, setViewType }: ViewTypeProp) => {
  const viewTypeOptions: viewTypes[] = ['Day', 'Week', 'Month'];
  return (
    <section className="flex gap-2">
      {viewTypeOptions.map((type, index) => (
        <button
          key={index}
          onClick={() => setViewType(type)}
          className={`${
            viewType === type ? 'bg-mint text-white' : 'text-default '
          } border-mint rounded-xl border px-4 text-lg font-bold`}
        >
          {type}
        </button>
      ))}
    </section>
  );
};

export default ViewType;
