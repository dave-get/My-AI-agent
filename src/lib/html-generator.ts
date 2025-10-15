// Safe HTML content generator for AI agent responses
// This utility helps create sanitized HTML content for frontend rendering

export interface HtmlStylingOptions {
  textColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  padding?: string;
  margin?: string;
  marginTop?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  fontFamily?: string;
  color?: string;
  lineHeight?: string;
  fontStyle?: string;
}

export interface HtmlElement {
  tag: string;
  content?: string;
  attributes?: Record<string, string>;
  styles?: HtmlStylingOptions;
  children?: HtmlElement[];
}

// Converts markdown-style formatting to HTML

export function convertMarkdownToHtml(content: string): string {
  // Convert **bold** to <strong>
  let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * Sanitizes HTML content by removing potentially dangerous elements and attributes
 * This is a basic sanitizer - in production, consider using DOMPurify or similar
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s(style|onload|onerror|onclick|onmouseover)\s*=\s*["'][^"']*["']/gi, '');
  
  return sanitized;
}

/**
 * Creates safe HTML content with styling
 */
export function createStyledHtml(
  content: string, 
  options: HtmlStylingOptions = {}
): string {
  const {
    textColor = '#333',
    backgroundColor = 'transparent',
    fontSize = '1rem',
    fontWeight = 'normal',
    textAlign = 'left',
    padding = '0',
    margin = '0',
    border = 'none',
    borderRadius = '0',
    boxShadow = 'none'
  } = options;

  const styles = `color: ${textColor}; background-color: ${backgroundColor}; font-size: ${fontSize}; font-weight: ${fontWeight}; text-align: ${textAlign}; padding: ${padding}; margin: ${margin}; border: ${border}; border-radius: ${borderRadius}; box-shadow: ${boxShadow}`;

  return `<div style="${styles}">${sanitizeHtml(convertMarkdownToHtml(content))}</div>`;
}

/**
 * Creates a structured HTML response with multiple elements
 */
export function createStructuredHtml(elements: HtmlElement[]): string {
  let html = '';
  
  for (const element of elements) {
    html += createHtmlElement(element);
  }
  
  return sanitizeHtml(html);
}

/**
 * Creates a single HTML element
 */
function createHtmlElement(element: HtmlElement): string {
  const { tag, content = '', attributes = {}, styles = {}, children = [] } = element;
  
  // Build attributes string
  let attributesStr = '';
  for (const [key, value] of Object.entries(attributes)) {
    attributesStr += ` ${key}="${value}"`;
  }
  
  // Build styles string
  let stylesStr = '';
  if (Object.keys(styles).length > 0) {
    const stylePairs = Object.entries(styles)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    stylesStr = ` style="${stylePairs}"`;
  }
  
  // Handle children
  let childrenHtml = '';
  if (children.length > 0) {
    childrenHtml = children.map(child => createHtmlElement(child)).join('');
  }
  
  // Convert markdown in content to HTML
  const processedContent = convertMarkdownToHtml(content);
  
  return `<${tag}${attributesStr}${stylesStr}>${processedContent}${childrenHtml}</${tag}>`;
}

/**
 * Predefined HTML templates for common response types
 */
export const htmlTemplates = {
  // Success message with green styling
  success: (message: string) => createStyledHtml(message, {
    backgroundColor: '#d4edda',
    textColor: '#155724',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #c3e6cb'
  }),
  
  // Error message with red styling
  error: (message: string) => createStyledHtml(message, {
    backgroundColor: '#f8d7da',
    textColor: '#721c24',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb'
  }),
  
  // Info message with blue styling
  info: (message: string) => createStyledHtml(message, {
    backgroundColor: '#d1ecf1',
    textColor: '#0c5460',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #bee5eb'
  }),
  
  // Warning message with yellow styling
  warning: (message: string) => createStyledHtml(message, {
    backgroundColor: '#fff3cd',
    textColor: '#856404',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #ffeaa7'
  }),
  
  // Code block with monospace font
  code: (code: string) => createStyledHtml(code, {
    backgroundColor: '#f8f9fa',
    textColor: '#e83e8c',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
    fontFamily: 'monospace'
  }),
  
  // Highlighted text
  highlight: (text: string) => createStyledHtml(text, {
    backgroundColor: '#fff3cd',
    padding: '2px 4px',
    borderRadius: '2px',
    fontWeight: 'bold'
  })
};

/**
 * Creates a card-style layout for structured data
 */
export function createCardHtml(title: string, content: string, category?: string): string {
  const elements: HtmlElement[] = [
    {
      tag: 'div',
      attributes: { class: 'response-card' },
      styles: {
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      children: [
        {
          tag: 'h3',
          content: title,
          styles: {
            margin: '0 0 12px 0',
            color: '#1976d2',
            fontSize: '1.2rem'
          }
        },
        {
          tag: 'div',
          content: content,
          styles: {
            lineHeight: '1.6',
            color: '#333'
          }
        },
        ...(category ? [{
          tag: 'div',
          content: `Category: ${category}`,
          styles: {
            marginTop: '12px',
            fontSize: '0.875rem',
            color: '#666',
            fontStyle: 'italic'
          }
        }] : [])
      ]
    }
  ];
  
  return createStructuredHtml(elements);
}
