interface KeywordProps {
  key: number;
  text: string;
  styles?: string;
}

const Keyword = ({ key, text, styles }: KeywordProps) => {
  return (
    <div
      key={key}
      className={`bg-mint w-max rounded-lg px-3 py-2 font-semibold ${styles ? styles : ''}`}
    >
      <p>#{text}</p>
    </div>
  );
};

export default Keyword;
