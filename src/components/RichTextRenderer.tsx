import React from 'react'

type LexicalNode = {
  type: string; version?: number; tag?: string; format?: number | string;
  indent?: number; direction?: string; children?: LexicalNode[];
  text?: string; url?: string; altText?: string; src?: string;
  width?: number; height?: number; listType?: string; value?: number;
}

function serializeNode(node: LexicalNode): React.ReactNode {
  switch (node.type) {
    case 'root': return <>{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</>
    case 'paragraph': return <p>{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</p>
    case 'heading': { const Tag = (node.tag as any) ?? 'h2'; return <Tag>{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</Tag> }
    case 'list': return node.listType === 'number' ? <ol>{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</ol> : <ul>{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</ul>
    case 'listitem': return <li>{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</li>
    case 'quote': return <blockquote>{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</blockquote>
    case 'link': return <a href={node.url} target="_blank" rel="noopener noreferrer">{(node.children ?? []).map((c, i) => <React.Fragment key={i}>{serializeNode(c)}</React.Fragment>)}</a>
    case 'text': {
      let content: React.ReactNode = node.text ?? ''
      const fmt = typeof node.format === 'number' ? node.format : 0
      if (fmt & 1) content = <strong>{content}</strong>
      if (fmt & 2) content = <em>{content}</em>
      if (fmt & 8) content = <u>{content}</u>
      if (fmt & 16) content = <s>{content}</s>
      if (fmt & 32) content = <code>{content}</code>
      return content
    }
    case 'linebreak': return <br />
    default: return null
  }
}

export function RichTextRenderer({ content }: { content: unknown }) {
  if (!content || typeof content !== 'object') return null
  const root = (content as any).root
  return <div className="prose-ticker">{root ? serializeNode(root) : null}</div>
}
