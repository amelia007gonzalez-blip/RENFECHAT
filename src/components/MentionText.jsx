const MENTION_PATTERN = /(@[\p{L}\p{N}_.-]{1,20})/u;

const MentionText = ({ text, isMe }) => (
  <>
    {text.split(MENTION_PATTERN).map((part, index) => (
      index % 2 === 1
        ? <span key={index} className={`font-black rounded px-1 ${isMe ? 'bg-white/25 text-white' : 'bg-amber-400/15 text-amber-300'}`}>{part}</span>
        : <span key={index}>{part}</span>
    ))}
  </>
);

export default MentionText;
