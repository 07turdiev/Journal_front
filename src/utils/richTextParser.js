import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
});

export function parseMarkdown(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') {
    return '';
  }
  
  try {
    const html = marked.parse(markdownText);
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['center'],
      ADD_ATTR: ['target', 'rel']
    });
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return '';
  }
}

export function getPlainTextFromMarkdown(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') {
    return '';
  }
  
  try {
    const html = marked.parse(markdownText);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(html);
    return tempDiv.textContent || tempDiv.innerText || '';
  } catch (error) {
    console.error('Markdown to plain text error:', error);
    return '';
  }
}

export function parseRichText(richTextArray) {
  if (!Array.isArray(richTextArray)) {
    return ''
  }

  return richTextArray.map(block => {
    return parseBlock(block)
  }).filter(html => html !== '').join('')
}

// Har bir block'ni parse qilish
function parseBlock(block) {
  if (!block || !block.type) return ''

  switch (block.type) {
    case 'paragraph':
      return parseParagraph(block)
    case 'heading':
      return parseHeading(block)
    case 'list':
      return parseList(block)
    case 'quote':
      return parseQuote(block)
    case 'code':
      return parseCode(block)
    default:
      return ''
  }
}

// Paragraph parse qilish
function parseParagraph(block) {
  const text = parseChildren(block.children || [])
  return text.trim() !== '' ? `<p>${text}</p>` : ''
}

// Heading parse qilish
function parseHeading(block) {
  const level = block.level || 1
  const text = parseChildren(block.children || [])
  return text.trim() !== '' ? `<h${level}>${text}</h${level}>` : ''
}

// List parse qilish
function parseList(block) {
  const tag = block.format === 'ordered' ? 'ol' : 'ul'
  const items = (block.children || []).map(item => {
    if (item.type === 'list-item') {
      const text = parseChildren(item.children || [])
      return `<li>${text}</li>`
    }
    return ''
  }).filter(item => item !== '')
  
  return items.length > 0 ? `<${tag}>${items.join('')}</${tag}>` : ''
}

// Quote parse qilish
function parseQuote(block) {
  const text = parseChildren(block.children || [])
  return text.trim() !== '' ? `<blockquote>${text}</blockquote>` : ''
}

// Code parse qilish
function parseCode(block) {
  const text = parseChildren(block.children || [])
  return text.trim() !== '' ? `<pre><code>${text}</code></pre>` : ''
}

// Children'larni parse qilish
function parseChildren(children) {
  return children.map(child => {
    if (child.type === 'text') {
      return parseTextNode(child)
    } else if (child.type === 'link') {
      return parseLink(child)
    } else if (child.type === 'bold' || child.type === 'italic' || child.type === 'underline') {
      return parseFormatting(child)
    }
    return child.text || ''
  }).join('')
}

// Text node parse qilish
function parseTextNode(node) {
  let text = node.text || ''
  
  // Bold
  if (node.bold) {
    text = `<strong>${text}</strong>`
  }
  
  // Italic
  if (node.italic) {
    text = `<em>${text}</em>`
  }
  
  // Underline
  if (node.underline) {
    text = `<u>${text}</u>`
  }
  
  // Strikethrough
  if (node.strikethrough) {
    text = `<s>${text}</s>`
  }
  
  return text
}

// Link parse qilish
function parseLink(node) {
  const url = node.url || '#'
  const text = parseChildren(node.children || [])
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
}

// Formatting parse qilish
function parseFormatting(node) {
  const text = parseChildren(node.children || [])
  
  switch (node.type) {
    case 'bold':
      return `<strong>${text}</strong>`
    case 'italic':
      return `<em>${text}</em>`
    case 'underline':
      return `<u>${text}</u>`
    default:
      return text
  }
}

// Rich text dan oddiy matn olish uchun
export function getPlainText(richTextArray) {
  if (!Array.isArray(richTextArray)) {
    return ''
  }

  return richTextArray.map(block => {
    return extractTextFromBlock(block)
  }).filter(text => text.trim() !== '').join(' ')
}

// Block'dan oddiy matn olish
function extractTextFromBlock(block) {
  if (!block || !block.type) return ''

  switch (block.type) {
    case 'paragraph':
    case 'heading':
    case 'quote':
    case 'code':
      return extractTextFromChildren(block.children || [])
    case 'list':
      return (block.children || [])
        .map(item => item.type === 'list-item' ? extractTextFromChildren(item.children || []) : '')
        .filter(text => text.trim() !== '')
        .join(' ')
    default:
      return ''
  }
}

// Children'dan oddiy matn olish
function extractTextFromChildren(children) {
  return children.map(child => {
    if (child.type === 'text') {
      return child.text || ''
    } else if (child.type === 'link') {
      return extractTextFromChildren(child.children || [])
    } else if (child.type === 'bold' || child.type === 'italic' || child.type === 'underline') {
      return extractTextFromChildren(child.children || [])
    }
    return ''
  }).join('')
}