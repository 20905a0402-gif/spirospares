type TextWithEVHighlightProps = {
  text: string;
  className?: string;
};

export default function TextWithEVHighlight({ text, className = "" }: TextWithEVHighlightProps) {
  const chunks = text.split(/(\bEV\b)/gi);

  return (
    <span className={className}>
      {chunks.map((chunk, index) =>
        chunk.toUpperCase() === "EV" ? (
          <span key={`${chunk}-${index}`} className="font-bold text-[#00A3FF] drop-shadow-[0_0_8px_rgba(181,189,200,0.5)]">
            {chunk}
          </span>
        ) : (
          <span key={`${chunk}-${index}`}>{chunk}</span>
        )
      )}
    </span>
  );
}

