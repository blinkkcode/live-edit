import {BasePart, Part} from '.';
import {LiveEditorApiComponent, ProjectData, WorkspaceData} from '../api';
import {TemplateResult, html} from 'lit-html';
import {LiveEditor} from '../editor';
import {expandClasses} from '@blinkk/selective-edit/dist/src/utility/dom';

export interface OverviewPartConfig {
  api: LiveEditorApiComponent;
}

export class OverviewPart extends BasePart implements Part {
  config: OverviewPartConfig;
  project?: ProjectData;
  workspace?: WorkspaceData;

  constructor(config: OverviewPartConfig) {
    super();
    this.config = config;

    // Load the project information.
    this.config.api.getProject().then(data => {
      this.project = data;
      this.render();
    });

    // Load the workspace information.
    this.config.api.getWorkspace().then(data => {
      this.workspace = data;
      this.render();
    });
  }

  classesForPart(): Array<string> {
    return ['le__part__overview'];
  }

  template(editor: LiveEditor): TemplateResult {
    return html`<div class=${expandClasses(this.classesForPart())}>
      ${this.templateMenu(editor)} ${this.templateProject(editor)}
      ${this.templateWorkspace(editor)}
    </div>`;
  }

  templateMenu(editor: LiveEditor): TemplateResult {
    if (editor.parts.menu.isDocked) {
      return html``;
    }

    const handleMenuClick = () => {
      editor.parts.menu.toggle();
    };

    return html`<div
      class="le__part__overview__menu le__clickable"
      @click=${handleMenuClick}
    >
      <span class="material-icons">menu</span>
    </div>`;
  }

  templateProject(editor: LiveEditor): TemplateResult {
    let projectName = this.project?.title || html`&nbsp;`;

    // Menu shows the project name when it is docked.
    if (editor.parts.menu.isDocked) {
      projectName = html`&nbsp;`;
    }

    return html`<div class="le__part__overview__title">${projectName}</div>`;
  }

  templateWorkspace(editor: LiveEditor): TemplateResult {
    return html`<div class="le__part__overview__workspace">
      <span>Workspace:</span>
      <strong>${this.workspace?.name || '...'}</strong> @
      <strong>${(this.workspace?.branch.commit || '...').slice(0, 5)}</strong>
      by <strong>${this.workspace?.branch.author.name || '...'}</strong> (time
      ago)
    </div>`;
  }
}
