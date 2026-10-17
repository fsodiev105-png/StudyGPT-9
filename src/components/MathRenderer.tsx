import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Render inline and block KaTeX safely
  const renderMathWithKatex = (text: string): React.ReactNode[] => {
    // Split by block math $$...$$ first, then inline $...$
    const parts: React.ReactNode[] = [];
    const blockRegex = /\$\$([\s\S]*?)\$\$/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Process blocks
    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index);
        parts.push(...processInlineMathAndMarkdown(textBefore, `pre-${lastIndex}`));
      }

      const mathSource = match[1].trim();
      try {
        const html = katex.renderToString(mathSource, {
          displayMode: true,
          throwOnError: false,
        });
        parts.push(
          <div
            key={`block-${match.index}`}
            className="my-3 overflow-x-auto py-1.5 px-3 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        parts.push(
          <pre key={`block-err-${match.index}`} className="my-2 p-2 bg-red-50 text-red-700 text-sm rounded">
            $${mathSource}$$
          </pre>
        );
      }

      lastIndex = blockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(...processInlineMathAndMarkdown(text.substring(lastIndex), `post-${lastIndex}`));
    }

    return parts;
  };

  const processInlineMathAndMarkdown = (rawText: string, keyPrefix: string): React.ReactNode[] => {
    // Process inline math $...$
    const inlineRegex = /\$([^\$\n]+?)\$/g;
    const nodes: React.ReactNode[] = [];
    let lastIdx = 0;
    let inlineMatch: RegExpExecArray | null;

    while ((inlineMatch = inlineRegex.exec(rawText)) !== null) {
      if (inlineMatch.index > lastIdx) {
        nodes.push(
          <span key={`${keyPrefix}-txt-${lastIdx}`}>
            {formatSimpleMarkdown(rawText.substring(lastIdx, inlineMatch.index))}
          </span>
        );
      }

      const mathStr = inlineMatch[1];
      try {
        const html = katex.renderToString(mathStr, {
          displayMode: false,
          throwOnError: false,
        });
        nodes.push(
          <span
            key={`${keyPrefix}-inline-${inlineMatch.index}`}
            className="inline-math mx-0.5 inline-block font-serif"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (e) {
        nodes.push(<span key={`${keyPrefix}-err-${inlineMatch.index}`}>${mathStr}$</span>);
      }

      lastIdx = inlineRegex.lastIndex;
    }

    if (lastIdx < rawText.length) {
      nodes.push(
        <span key={`${keyPrefix}-txt-${lastIdx}`}>
          {formatSimpleMarkdown(rawText.substring(lastIdx))}
        </span>
      );
    }

    return nodes;
  };

  // Basic markdown formatting: bold, italic, lists, quotes, badges
  const formatSimpleMarkdown = (text: string): React.ReactNode => {
    // Split lines to preserve paragraphs and lists
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Check for headings
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1.5 flex items-center gap-1.5">
            {renderBoldItalic(line.replace('### ', ''))}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 flex items-center gap-2">
            {renderBoldItalic(line.replace('## ', ''))}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-xl font-extrabold text-slate-900 dark:text-white mt-4 mb-2">
            {renderBoldItalic(line.replace('# ', ''))}
          </h2>
        );
      }

      // Check for bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-2">
            <span className="text-indigo-500 font-bold mt-1 text-xs">•</span>
            <span className="flex-1 text-slate-800 dark:text-slate-200">{renderBoldItalic(bulletText)}</span>
          </div>
        );
      }

      // Check for numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold text-xs shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <span className="flex-1 text-slate-800 dark:text-slate-200">{renderBoldItalic(numMatch[2])}</span>
          </div>
        );
      }

      // Empty line -> break
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Normal paragraph line
      return (
        <p key={idx} className="leading-relaxed my-0.5 text-slate-800 dark:text-slate-200">
          {renderBoldItalic(line)}
        </p>
      );
    });
  };

  const renderBoldItalic = (str: string): React.ReactNode => {
    // Regex for bold **text**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        // Highlight status tags
        let tagColor = 'text-slate-900 dark:text-white font-bold';
        if (inner.includes('✅') || inner.startsWith('Ответ:')) {
          tagColor = 'text-emerald-600 dark:text-emerald-400 font-bold';
        } else if (inner.includes('❌')) {
          tagColor = 'text-rose-600 dark:text-rose-400 font-bold';
        } else if (inner.includes('⚠️')) {
          tagColor = 'text-amber-600 dark:text-amber-400 font-bold';
        }
        return (
          <strong key={i} className={tagColor}>
            {inner}
          </strong>
        );
      }
      return part;
    });
  };

  return <div className={`math-renderer space-y-1 text-[15px] ${className}`}>{renderMathWithKatex(content)}</div>;
};
