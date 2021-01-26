import {BasePart, Part} from '..';
import {
  TemplateResult,
  expandClasses,
  html,
  repeat,
} from '@blinkk/selective-edit';
import {ContentSectionPart} from './index';
import {LiveEditor} from '../../editor';

export interface ContentHeaderConfig {
  sections: Array<ContentSectionPart>;
}

export class ContentHeaderPart extends BasePart implements Part {
  config: ContentHeaderConfig;

  constructor(config: ContentHeaderConfig) {
    super();
    this.config = config;
  }

  classesForPart(): Array<string> {
    const classes = ['le__part__content__header'];
    return classes;
  }

  handleSectionClick(evt: Event, section: ContentSectionPart) {
    for (const sectionPart of this.config.sections) {
      sectionPart.isVisible = false;
    }
    section.isVisible = true;
    this.render();
  }

  template(editor: LiveEditor): TemplateResult {
    return html`<div class=${expandClasses(this.classesForPart())}>
      <div class="le__part__content__header__sections">
        ${repeat(
          this.config.sections,
          section => section.section,
          section =>
            html`<div
              class="le__part__content__header__section le__clickable ${section.isVisible
                ? 'le__part__content__header__section--selected'
                : ''}"
              @click=${(evt: Event) => this.handleSectionClick(evt, section)}
            >
              ${section.label}
            </div>`
        )}
      </div>
      <div class="le__part__content__header__actions">
        <button class="le__button le__button--primary">Save changes</button>
      </div>
    </div>`;
  }
}
