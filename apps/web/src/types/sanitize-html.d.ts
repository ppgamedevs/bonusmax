declare module 'sanitize-html' {
  export interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    [key: string]: any;
  }
  function sanitizeHtml(html: string, options?: IOptions): string;
  export default sanitizeHtml;
}
