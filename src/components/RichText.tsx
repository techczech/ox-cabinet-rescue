interface RichTextProps {
  text: string;
  className?: string;
}

const htmlRegex = /<\/?[a-z][\s\S]*>/i;

export default function RichText({ text, className }: RichTextProps) {
  if (htmlRegex.test(text)) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: text }} />;
  }

  return <p className={className ? `${className} whitespace-pre-line` : 'whitespace-pre-line'}>{text}</p>;
}
