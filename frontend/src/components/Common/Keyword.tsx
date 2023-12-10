interface KeywordProps {
  text: string;
  styles?: string;
}

const Keyword = ({ text, styles }: KeywordProps) => {
  return (
    <div
      className={`bg-mint mb-3 w-max rounded-lg px-3 py-2 font-semibold ${styles ? styles : ''}`}
    >
      <p>#{text}</p>
    </div>
  );
};

export default Keyword;
