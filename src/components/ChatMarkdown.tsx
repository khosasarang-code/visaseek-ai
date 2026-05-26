"use client";

import ReactMarkdown from "react-markdown";

export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-4 text-xl font-bold text-gray-900">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-4 text-lg font-semibold text-gray-900">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-3 text-base font-semibold text-gray-900">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-2 leading-relaxed text-gray-800">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-700">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pl-5 text-gray-800">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-gray-800">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-gray-800">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-300 px-3 py-2">{children}</td>
        ),
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className="block rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                {children}
              </code>
            );
          }
          return (
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-3 overflow-x-auto rounded-lg">{children}</pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
