import {TemplateResult, classMap, html} from '@blinkk/selective-edit';
import {options} from 'marked';
import {ApiError} from '../api';
import {LiveEditor} from '../editor';

export interface ErrorUiOptions {
  /**
   * Should the error message include full padding?
   */
  pad?: boolean;
}

export function templateApiError(
  editor: LiveEditor,
  error?: ApiError,
  options?: ErrorUiOptions
): TemplateResult {
  if (!error) {
    return html``;
  }
  return html`<div
    class=${classMap({
      le__error: true,
      'le__error--pad': Boolean(options?.pad),
    })}
  >
    <div class="le__error__message">${error.message}</div>
    ${error.description
      ? html`<p class="le__error__description">${error.description}</p>`
      : ''}
  </div>`;
}
