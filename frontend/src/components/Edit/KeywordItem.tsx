interface KeywordItemProps {
  keywordList: string[];
}

const KeywordItem = ({ keywordList }: KeywordItemProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {keywordList.map((keyword, index) => (
        <div
          className="bg-mint flex h-9 items-center justify-center rounded-lg px-3 text-base"
          key={index}
        >
          #{keyword}
        </div>
      ))}
    </div>
  );
};

export default KeywordItem;
