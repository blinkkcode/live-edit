import {ApiError, WorkspaceData} from '../../api';
import {
  DeepObject,
  TemplateResult,
  classMap,
  html,
} from '@blinkk/selective-edit';
import {DialogActionLevel, FormDialogModal} from '../../ui/modal';
import {MenuSectionPart, MenuSectionPartConfig} from './index';
import {EVENT_WORKSPACE_LOAD} from '../../events';
import {FeatureFlags} from '../../features';
import {LiveEditor} from '../../editor';
import merge from 'lodash.merge';
import {repeat} from '@blinkk/selective-edit';
import {templateLoading} from '../../template';

const MODAL_KEY_NEW = 'menu_workspace_new';

export class WorkspacesPart extends MenuSectionPart {
  constructor(config: MenuSectionPartConfig) {
    super(config);

    document.addEventListener(EVENT_WORKSPACE_LOAD, (evt: Event) => {
      const customEvent: CustomEvent = evt as CustomEvent;
      this.config.state.loadWorkspace(customEvent.detail as WorkspaceData);
    });
  }

  classesForPart(): Record<string, boolean> {
    const classes = super.classesForPart();
    classes.le__part__menu__workspaces = true;
    return classes;
  }

  classesForWorkspace(workspace: WorkspaceData): Record<string, boolean> {
    return {
      le__clickable: true,
      le__list__item: true,
      'le__list__item--selected':
        this.config.state.workspace?.name === workspace.name,
    };
  }

  protected getOrCreateModalNew(editor: LiveEditor): FormDialogModal {
    if (!editor.parts.modals.modals[MODAL_KEY_NEW]) {
      // Setup the editor.
      const options = [];
      for (const workspace of this.config.state.workspaces || []) {
        options.push({
          label: workspace.name,
          value: workspace.branch.name,
        });
      }

      const selectiveConfig = merge(
        {
          fields: [
            {
              type: 'radio',
              key: 'base',
              label: 'Parent workspace',
              help: 'Workspace to start the new workspace from.',
              options: options,
              validation: [
                {
                  type: 'require',
                  message: 'Parent workspace is required.',
                },
              ],
            },
            {
              type: 'text',
              key: 'workspace',
              label: 'New workspace name',
              help: 'Used for the workspace url and the git branch.',
              validation: [
                {
                  type: 'require',
                  message: 'Workspace name is required.',
                },
                {
                  type: 'pattern',
                  pattern: '^[a-z0-9-]*$',
                  message:
                    'Workspace name can only contain lowercase alpha-numeric characters and - (dash).',
                },
                {
                  type: 'match',
                  excluded: {
                    values: ['main', 'master', 'staging'],
                    message:
                      'Workspace name cannot be "main", "master", or "staging".',
                  },
                },
              ],
            },
          ],
        },
        editor.config.selectiveConfig
      );
      const modal = new FormDialogModal({
        title: 'New workspace',
        selectiveConfig: selectiveConfig,
        state: this.config.state,
      });
      modal.templateModal = this.templateNewWorkspace.bind(this);
      modal.actions.push({
        label: 'Create workspace',
        level: DialogActionLevel.Primary,
        isDisabledFunc: () => {
          return modal.isProcessing || !modal.selective.isValid;
        },
        isSubmit: true,
        onClick: () => {
          const value = modal.selective.value;
          modal.startProcessing();

          // Find the full workspace information for the base workspace.
          let baseWorkspace: WorkspaceData | undefined = undefined;
          for (const workspace of this.config.state.workspaces || []) {
            if (workspace.branch.name === value.base) {
              baseWorkspace = workspace;
            }
          }

          if (!baseWorkspace) {
            modal.error = {
              message: `Unable to find the base workspace information for '${value.base}'`,
            };
            modal.stopProcessing();
            return;
          }

          this.config.state.createWorkspace(
            baseWorkspace,
            value.workspace,
            (workspace: WorkspaceData) => {
              // Log the success to the notifications.
              editor.parts.notifications.showNotification({
                message: `New '${workspace.name}' workspace successfully created.`,
                actions: [
                  {
                    label: 'Visit workspace',
                    customEvent: EVENT_WORKSPACE_LOAD,
                    details: workspace,
                  },
                ],
                title: 'New workspace created',
              });
              // Reset the data for the next time the form is shown.
              modal.data = new DeepObject();
              modal.stopProcessing(true);
            },
            (error: ApiError) => {
              // Log the error to the notifications.
              editor.parts.notifications.addError(error, true);
              modal.error = error;
              modal.stopProcessing();
            }
          );
        },
      });
      modal.addCancelAction();
      editor.parts.modals.modals[MODAL_KEY_NEW] = modal;
    }
    return editor.parts.modals.modals[MODAL_KEY_NEW] as FormDialogModal;
  }

  loadWorkspace() {
    this.config.state.getWorkspace();
  }

  loadWorkspaces() {
    this.config.state.getWorkspaces();
  }

  templateContent(editor: LiveEditor): TemplateResult {
    // Lazy load the workspace information.
    if (!this.config.state.workspace) {
      this.loadWorkspace();
    }

    // Lazy load the workspaces information.
    if (!this.config.state.workspaces) {
      this.loadWorkspaces();
    }

    if (!this.config.state.workspaces) {
      return templateLoading({
        pad: true,
      });
    }

    return html`<div class="le__part__menu__section__content">
      <div
        class="le__list le__list--menu le__list--constrained le__list--indent"
      >
        ${this.templateCreateWorkspace(editor)}
        ${repeat(
          this.config.state.workspaces || [],
          workspace => workspace.name,
          workspace => html`<div
            class=${classMap(this.classesForWorkspace(workspace))}
            @click=${() => {
              this.config.state.loadWorkspace(workspace);
            }}
          >
            <div class="le__list__item__icon">
              <span class="material-icons">dashboard</span>
            </div>
            <div class="le__list__item__label">${workspace.name}</div>
          </div>`
        )}
      </div>
    </div>`;
  }

  templateCreateWorkspace(editor: LiveEditor): TemplateResult {
    if (this.config.state.features.isOff(FeatureFlags.WorkspaceCreate)) {
      return html``;
    }

    const handleNewClick = () => {
      const modal = this.getOrCreateModalNew(editor);
      modal.show();
    };

    return html`<div
      class="le__list__item le__list__item--primary le__clickable"
      @click=${handleNewClick}
    >
      <div class="le__list__item__icon">
        <span class="material-icons">add_circle</span>
      </div>
      <div class="le__list__item__label">
        ${editor.config.labels?.workspaceNew || 'Add workspace'}
      </div>
    </div>`;
  }

  templateNewWorkspace(editor: LiveEditor): TemplateResult {
    const modal = this.getOrCreateModalNew(editor);
    const isValid = modal.selective.isValid;
    try {
      return modal.selective.template(modal.selective, modal.data);
    } finally {
      if (isValid !== modal.selective.isValid) {
        this.render();
      }
    }
  }

  templateTitle(editor: LiveEditor): TemplateResult {
    return html`<div class="le__part__menu__section__title">
      ${editor.config.labels?.menuWorkspaces || this.title}
    </div>`;
  }

  get title(): string {
    return 'Workspaces';
  }
}
