interface KeywordProps {
  key: number;
  text: string;
}

const Keyword = ({ key, text }: KeywordProps) => {
  return (
    <div key={key} className="bg-mint w-max rounded-lg px-3 py-2 font-semibold">
      <p>#{text}</p>
    </div>
  );
};

export default Keyword;
