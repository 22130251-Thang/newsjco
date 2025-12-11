import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

type CheerioAPI = ReturnType<typeof cheerio.load>;


const REMOVE_ELEMENTS = [
  'script',
  'style',
  'link',
  'meta',
  'noscript',
  'svg',
  'button',
  'input',
  'form',
  'nav',
];


const PRESERVED_ATTRIBUTES: Record<string, string[]> = {
  img: ['src', 'alt'],
  a: ['href', 'target', 'rel'],
  iframe: ['src', 'width', 'height'],
  video: ['src', 'width', 'height'],
};


function preserveOnlyAttributes(
  $: CheerioAPI,
  element: Element,
  allowedAttrs: string[],
): void {
  const el = $(element);
  const currentAttrs = { ...element.attribs };

  Object.keys(currentAttrs).forEach((attr) => el.removeAttr(attr));

  allowedAttrs.forEach((attr) => {
    const value = currentAttrs[attr];
    if (value) el.attr(attr, value);
  });
}


function removeDataAndEventAttributes($: CheerioAPI, element: Element): void {
  if (!element.attribs) return;

  const el = $(element);
  Object.keys(element.attribs).forEach((attr) => {
    if (attr.startsWith('data-') || attr.startsWith('on')) {
      el.removeAttr(attr);
    }
  });
}


export function sanitizeHtmlForTypography(html: string): string {
  if (!html) return '';

  const $ = cheerio.load(html);

  REMOVE_ELEMENTS.forEach((tag) => $(tag).remove());

  $('aside:not(:has(p))').remove();
  $('header:not(:has(h1,h2,h3))').remove();

  $('*').each((_, node) => {
    const element = node as Element;
    const tagName = element.tagName?.toLowerCase();

    if (tagName && PRESERVED_ATTRIBUTES[tagName]) {
      preserveOnlyAttributes($, element, PRESERVED_ATTRIBUTES[tagName]);

      if (tagName === 'a') {
        const el = $(element);
        if (el.attr('target') === '_blank') {
          el.attr('rel', 'noopener noreferrer');
        }
      }

      if (['img', 'iframe', 'video'].includes(tagName)) {
        $(element).attr('loading', 'lazy');
      }
    } else {
      const el = $(element);
      el.removeAttr('class').removeAttr('style').removeAttr('id');
      removeDataAndEventAttributes($, element);
    }
  });

  unwrapEmptyWrappers($);

  return $('body').html() || '';
}


function unwrapEmptyWrappers($: CheerioAPI): void {
  ['span', 'div'].forEach((tag) => {
    $(tag).each((_, node) => {
      const element = node as Element;
      const el = $(element);
      const hasNoAttrs =
        !element.attribs || Object.keys(element.attribs).length === 0;
      const content = el.html() || '';

      if (hasNoAttrs && content) {
        if (tag === 'div' && el.children().length === 0 && content.trim()) {
          el.replaceWith(`<p>${content}</p>`);
        } else {
          el.replaceWith(content);
        }
      }
    });
  });
}
