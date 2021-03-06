import {ApiError, EditorFileData, FileData} from '../../api';
import {
  DeepObject,
  TemplateResult,
  classMap,
  html,
} from '@blinkk/selective-edit';
import {DialogActionLevel, FormDialogModal} from '../../ui/modal';
import {
  IncludeExcludeFilter,
  IncludeExcludeFilterConfig,
} from '../../../utility/filter';
import {MenuSectionPart, MenuSectionPartConfig} from './index';

import {DataStorage} from '../../../utility/dataStorage';
import {EVENT_FILE_LOAD} from '../../events';
import {LiveEditor} from '../../editor';
import {RuleConfig} from '@blinkk/selective-edit/dist/selective/validationRules';
import {StatePromiseKeys} from '../../state';
import merge from 'lodash.merge';
import {repeat} from '@blinkk/selective-edit';
import {templateLoading} from '../../template';

const DEFAULT_SITE_FILTER: IncludeExcludeFilterConfig = {
  includes: [/\.(yaml|yml|html|md)$/],
  excludes: [/\/[_.]/],
};
const MODAL_KEY_COPY = 'menu_file_copy';
const MODAL_KEY_DELETE = 'menu_file_delete';
const MODAL_KEY_NEW = 'menu_file_new';
const STORAGE_FILE_EXPANDED = 'live.menu.site.expandedDirs';

interface DirectoryEventHandlers {
  fileCopy: (evt: Event, file: FileData) => void;
  fileDelete: (evt: Event, file: FileData) => void;
  fileLoad: (evt: Event, file: FileData) => void;
  fileNew: (evt: Event, directory: string) => void;
  render: () => void;
}

export class SitePart extends MenuSectionPart {
  fileStructure?: DirectoryStructure;

  constructor(config: MenuSectionPartConfig) {
    super(config);

    // Recreate the file structure whenever the files are reloaded.
    this.config.state.addListener(StatePromiseKeys.GetFiles, () => {
      this.fileStructure = undefined;
      this.render();
    });
  }

  classesForPart(): Record<string, boolean> {
    const classes = super.classesForPart();
    classes.le__part__menu__site = true;
    return classes;
  }

  protected getOrCreateModalCopy(editor: LiveEditor): FormDialogModal {
    if (!editor.parts.modals.modals[MODAL_KEY_COPY]) {
      const selectiveConfig = merge({}, editor.config.selectiveConfig);
      const modal = new FormDialogModal({
        title: 'Copy file',
        selectiveConfig: selectiveConfig,
        state: this.config.state,
      });
      modal.templateModal = this.templateFileCopy.bind(this);
      modal.actions.push({
        label: 'Copy file',
        level: DialogActionLevel.Primary,
        isDisabledFunc: () => {
          return modal.isProcessing || !modal.selective.isValid;
        },
        isSubmit: true,
        onClick: () => {
          const value = modal.selective.value;
          modal.startProcessing();

          this.config.state.copyFile(
            value.originalPath,
            value.path,
            (newFile: FileData) => {
              // Log the success to the notifications.
              editor.parts.notifications.addInfo({
                message: `New '${newFile.path}' file successfully created.`,
                actions: [
                  {
                    label: 'Load file',
                    customEvent: EVENT_FILE_LOAD,
                    details: newFile,
                  },
                ],
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
      editor.parts.modals.modals[MODAL_KEY_COPY] = modal;
    }
    return editor.parts.modals.modals[MODAL_KEY_COPY] as FormDialogModal;
  }

  protected getOrCreateModalDelete(editor: LiveEditor): FormDialogModal {
    if (!editor.parts.modals.modals[MODAL_KEY_DELETE]) {
      const selectiveConfig = merge({}, editor.config.selectiveConfig);
      const modal = new FormDialogModal({
        title: 'Delete file',
        selectiveConfig: selectiveConfig,
        state: this.config.state,
      });
      modal.templateModal = this.templateFileDelete.bind(this);
      modal.actions.push({
        label: 'Delete file',
        level: DialogActionLevel.Extreme,
        isDisabledFunc: () => false,
        isSubmit: true,
        onClick: () => {
          const path = modal.data.get('path');
          modal.startProcessing();

          this.config.state.deleteFile(
            {
              path: path,
            },
            () => {
              // Log the success to the notifications.
              editor.parts.notifications.addInfo({
                message: `Deleted '${path}' file successfully.`,
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
      editor.parts.modals.modals[MODAL_KEY_DELETE] = modal;
    }
    return editor.parts.modals.modals[MODAL_KEY_DELETE] as FormDialogModal;
  }

  protected getOrCreateModalNew(editor: LiveEditor): FormDialogModal {
    if (!editor.parts.modals.modals[MODAL_KEY_NEW]) {
      const selectiveConfig = merge({}, editor.config.selectiveConfig);
      const modal = new FormDialogModal({
        title: 'New file',
        selectiveConfig: selectiveConfig,
        state: this.config.state,
      });
      modal.templateModal = this.templateFileNew.bind(this);
      modal.actions.push({
        label: 'Create file',
        level: DialogActionLevel.Primary,
        isDisabledFunc: () => {
          return modal.isProcessing || !modal.selective.isValid;
        },
        isSubmit: true,
        onClick: () => {
          const value = modal.selective.value;
          modal.startProcessing();

          this.config.state.createFile(
            `${value.directory}${value.path}`,
            (newFile: FileData) => {
              // Log the success to the notifications.
              editor.parts.notifications.addInfo({
                message: `New '${newFile.path}' file successfully created.`,
                actions: [
                  {
                    label: 'Load file',
                    customEvent: EVENT_FILE_LOAD,
                    details: newFile,
                  },
                ],
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

  loadFiles() {
    this.config.state.getFiles(() => {
      this.fileStructure = undefined;
      this.render();
    });
  }

  loadProject() {
    this.config.state.getProject();
  }

  templateContent(editor: LiveEditor): TemplateResult {
    const project = this.config.state.project;
    const files = this.config.state.files;

    // Lazy load the project.
    if (!project) {
      this.loadProject();
    }

    // Lazy load the files.
    if (files === undefined) {
      this.loadFiles();
    }

    if (!project || files === undefined) {
      return templateLoading({
        pad: true,
      });
    }

    if (files.length === 0) {
      return html`<div class="le__part__menu__section__content">
        <div class="le__list">
          <div class="le__list__item">
            <div class="le__list__item__label">No files found.</div>
          </div>
        </div>
      </div>`;
    }

    if (!this.fileStructure) {
      const eventHandlers: DirectoryEventHandlers = {
        fileCopy: (evt: Event, file: FileData) => {
          evt.stopPropagation();
          const modal = this.getOrCreateModalCopy(editor);
          modal.data.set('originalPath', file.path);

          // TODO: Modify the new path so it is not automatically an error.
          modal.data.set('path', file.path);

          // Make the form field custom to the file being copied.
          modal.selective.resetFields();
          modal.selective.fields.addField({
            type: 'text',
            key: 'path',
            label: 'File path',
            help: `Copy '${file.path}' file to this new file.`,
            validation: [
              {
                type: 'require',
                message: 'File name is required.',
              } as RuleConfig,
              {
                type: 'pattern',
                pattern: '^[a-z0-9-_./]*$',
                message:
                  'File name can only contain lowercase alpha-numeric characters, . (period), _ (underscore), / (forward slash), and - (dash).',
              } as RuleConfig,
              {
                type: 'pattern',
                pattern: '/[a-z0-9]+[a-z0-9-_./]*$',
                message:
                  'File name in the sub directory needs to start with alpha-numeric characters.',
              } as RuleConfig,
              {
                type: 'pattern',
                pattern: '^/content/[a-z0-9]+/',
                message:
                  'File name needs to be in a collection (ex: /content/pages/).',
              } as RuleConfig,
              // TODO: Extension matching.
              // {
              //   type: 'pattern',
              //   pattern: `^.*\.(${originalExt})$`,
              //   message: `File name needs to end with ".${originalExt}" to match the original file.`,
              // },
              {
                type: 'match',
                excluded: {
                  values: [file.path],
                  message: 'Cannot copy to the same file.',
                },
              } as RuleConfig,
              // TODO: Existing file match checking.
              // {
              //   type: 'match',
              //   level: 'warning',
              //   excluded: {
              //     values: otherPodPaths,
              //     message:
              //       'File name already exists. Copying will overwrite the existing file.',
              //   },
              // },
            ],
          });

          modal.show();
        },
        fileDelete: (evt: Event, file: FileData) => {
          evt.stopPropagation();
          const modal = this.getOrCreateModalDelete(editor);
          modal.data.set('path', file.path);
          modal.show();
        },
        fileLoad: (evt: Event, file: FileData) => {
          evt.stopPropagation();
          document.dispatchEvent(
            new CustomEvent(EVENT_FILE_LOAD, {
              detail: file,
            })
          );
        },
        fileNew: (evt: Event, directory: string) => {
          evt.stopPropagation();
          const modal = this.getOrCreateModalNew(editor);
          modal.data.set('directory', directory);

          modal.selective.resetFields();
          modal.selective.fields.addField({
            type: 'text',
            key: 'path',
            label: 'File name',
            help: `Creating new file in the '${directory}' directory. File name may also be used in the url.`,
            validation: [
              {
                type: 'require',
                message: 'File name is required.',
              } as RuleConfig,
              {
                type: 'pattern',
                pattern: '^[a-z0-9-_./]*$',
                message:
                  'File name can only contain lowercase alpha-numeric characters, . (period), _ (underscore), / (forward slash), and - (dash).',
              } as RuleConfig,
              {
                type: 'pattern',
                pattern: '^[a-z0-9]+',
                message:
                  'File name needs to start with an alpha-numeric character.',
              } as RuleConfig,
            ],
          });

          modal.show();
        },
        render: this.render.bind(this),
      };

      // Determine what file filtering to use for the file list.
      let filterConfig = DEFAULT_SITE_FILTER;
      if (project.site?.files?.filter) {
        filterConfig = project.site.files.filter;
        // TODO: Allow for service specific default (ex: grow).
      }

      const filesFilter = new IncludeExcludeFilter(filterConfig);

      // Create the directory structure using the filtered files.
      this.fileStructure = new DirectoryStructure(
        files.filter(file => filesFilter.matches(file.path)),
        eventHandlers,
        this.config.storage
      );

      // If there is a file loaded, expand the directory out to show it.
      if (this.config.state.file) {
        this.fileStructure.expandToFile(this.config.state.file);
      }
    }

    return html`<div class="le__part__menu__section__content">
      <div class="le__list le__list--indent le__list--menu">
        <div class="le__list__item le__list__item--heading">
          <div class="le__list__item__icon">
            <span class="material-icons">folder</span>
          </div>
          <div class="le__list__item__label">
            ${editor.config.labels?.files || 'Files'}
          </div>
        </div>
        ${this.fileStructure.template(editor)}
      </div>
    </div>`;
  }

  templateFileCopy(editor: LiveEditor): TemplateResult {
    const modal = this.getOrCreateModalCopy(editor);
    const isValid = modal.selective.isValid;
    try {
      return modal.selective.template(modal.selective, modal.data);
    } finally {
      if (isValid !== modal.selective.isValid) {
        this.render();
      }
    }
  }

  templateFileDelete(editor: LiveEditor): TemplateResult {
    const modal = this.getOrCreateModalDelete(editor);
    return html`<div class="le__modal__content__template__padded">
      Do you want to delete the <code>${modal.data.get('path')}</code> file?
    </div>`;
  }

  templateFileNew(editor: LiveEditor): TemplateResult {
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
      ${editor.config.labels?.menuSite || this.title}
    </div>`;
  }

  get title() {
    return 'Site';
  }
}

class DirectoryStructure {
  rootFiles: Array<FileData>;
  root: string;
  directories: Record<string, DirectoryStructure>;
  eventHandlers: DirectoryEventHandlers;
  files: Array<FileData>;
  isExpanded?: boolean;
  storage: DataStorage;

  constructor(
    rootFiles: Array<FileData>,
    eventHandlers: DirectoryEventHandlers,
    storage: DataStorage,
    root = '/'
  ) {
    this.rootFiles = rootFiles;
    this.root = root;
    this.storage = storage;
    this.eventHandlers = eventHandlers;
    this.directories = {};
    this.files = [];

    if (this.root === '/') {
      this.isExpanded = true;
    }

    const currentExpandedPaths = this.storage.getItemArray(
      STORAGE_FILE_EXPANDED
    );
    if (currentExpandedPaths.includes(this.root)) {
      this.isExpanded = true;
    }

    for (const fileData of this.rootFiles) {
      const relativePath = fileData.path.slice(this.root.length);
      const pathParts = relativePath.split('/');
      // Directories have more segments.
      // First segment is empty string since it starts with /.
      if (pathParts.length > 1) {
        const directoryName = pathParts[0];
        if (!this.directories[directoryName]) {
          const subDirectoryRoot = `${this.root}${directoryName}/`;
          const subFiles = this.rootFiles.filter(fileData => {
            return fileData.path.startsWith(subDirectoryRoot);
          });
          this.directories[directoryName] = new DirectoryStructure(
            subFiles,
            this.eventHandlers,
            this.storage,
            subDirectoryRoot
          );
        }
      } else {
        this.files.push(fileData);
      }
    }
  }

  get base(): string {
    const trimmedRoot = this.root.replace(/^\/+/, '').replace(/\/+$/, '');
    const rootParts = trimmedRoot.split('/');
    return rootParts[rootParts.length - 1];
  }

  baseFromFilePath(file: FileData) {
    const fileName = this.fileFromFilePath(file);
    const fileParts = fileName.split('.');
    return fileParts.slice(0, -1).join('.');
  }

  expandToFile(file: EditorFileData) {
    // As long as the directory starts with the same path, expand it.
    if (file.file.path.startsWith(this.root)) {
      this.isExpanded = true;

      for (const key of Object.keys(this.directories)) {
        this.directories[key].expandToFile(file);
      }
    }
  }

  fileFromFilePath(file: FileData) {
    const pathParts = file.path.split('/');
    return pathParts[pathParts.length - 1];
  }

  handleExpandCollapse() {
    this.isExpanded = !this.isExpanded;

    const currentExpandedPaths = this.storage.getItemArray(
      STORAGE_FILE_EXPANDED
    );
    if (this.isExpanded) {
      // Add to the storage.
      currentExpandedPaths.push(this.root);
    } else {
      // Remove from the storage.
      for (let i = 0; i < currentExpandedPaths.length; i++) {
        if (currentExpandedPaths[i] === this.root) {
          currentExpandedPaths.splice(i, 1);
          break;
        }
      }
    }
    this.storage.setItemArray(STORAGE_FILE_EXPANDED, currentExpandedPaths);

    this.eventHandlers.render();
  }

  template(editor: LiveEditor): TemplateResult {
    if (!this.isExpanded) {
      return html``;
    }

    return html`${this.templateDirectories(editor)}
    ${this.templateFiles(editor)}`;
  }

  templateDirectories(editor: LiveEditor): TemplateResult {
    if (!this.directories) {
      return html``;
    }

    return html`<div class="le__list">
      ${repeat(
        Object.keys(this.directories),
        (key: string) => key,
        (key: string) => html`<div
            class="le__list__item le__list__item--secondary le__clickable"
            @click=${this.directories[key].handleExpandCollapse.bind(
              this.directories[key]
            )}
          >
            <div class="le__list__item__icon">
              <span class="material-icons"
                >${this.directories[key].isExpanded
                  ? 'expand_more'
                  : 'chevron_right'}</span
              >
            </div>
            <div class="le__list__item__label">
              ${this.directories[key].base}
            </div>
          </div>
          ${this.directories[key].template(editor)}`
      )}
    </div>`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  templateFiles(editor: LiveEditor): TemplateResult {
    if (!this.files || !this.files.length) {
      return html``;
    }

    return html`<div class="le__list le__list--hide-actions">
      <div
        class="le__list__item le__list__item--primary le__clickable"
        @click=${(evt: Event) => this.eventHandlers.fileNew(evt, this.root)}
      >
        <div class="le__list__item__icon">
          <span class="material-icons">add_circle</span>
        </div>
        <div class="le__list__item__label">
          ${editor.config.labels?.fileNew || 'New file'}
        </div>
      </div>
      ${repeat(
        this.files,
        (file: FileData) => file.path,
        (file: FileData) => html`<div
          class=${classMap({
            le__clickable: true,
            le__list__item: true,
            'le__list__item--selected':
              editor.state.file?.file.path === file.path ||
              editor.state.loadingFilePath === file.path,
          })}
          @click=${(evt: Event) => this.eventHandlers.fileLoad(evt, file)}
        >
          <div class="le__list__item__icon">
            <span class="material-icons">notes</span>
          </div>
          <div
            class="le__list__item__label"
            title=${this.fileFromFilePath(file)}
          >
            ${this.baseFromFilePath(file)}
          </div>
          <div class="le__actions le__actions--slim">
            <div
              class="le__actions__action le__clickable le__tooltip--top"
              @click=${(evt: Event) => this.eventHandlers.fileCopy(evt, file)}
              data-tip="Duplicate file"
            >
              <span class="material-icons">file_copy</span>
            </div>
            <div
              class="le__actions__action le__actions__action--extreme le__clickable le__tooltip--top-left"
              @click=${(evt: Event) => this.eventHandlers.fileDelete(evt, file)}
              data-tip="Delete file"
            >
              <span class="material-icons">remove_circle</span>
            </div>
          </div>
        </div>`
      )}
    </div>`;
  }
}
