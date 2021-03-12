import {
  DeviceData,
  EditorFileData,
  FileData,
  LiveEditorApiComponent,
  ProjectData,
  PublishResult,
  PublishStatus,
  SiteData,
  UrlLevel,
  UserData,
  WorkspaceData,
} from '../../editor/api';
import {TextFieldConfig} from '@blinkk/selective-edit';

const DEFAULT_EDITOR_FILE: EditorFileData = {
  content: 'Example content.',
  data: {
    title: 'Testing',
  },
  dataRaw: 'title: Testing',
  file: {
    path: '/content/pages/index.yaml',
  },
  editor: {
    fields: [
      {
        type: 'text',
        key: 'title',
        label: 'Title',
        validation: [
          {
            type: 'require',
            message: 'Title is required.',
          },
        ],
      } as TextFieldConfig,
    ],
  },
  history: [
    {
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      hash: 'db29a258dacdd416bb24bb63c689d669df08d409',
      summary: 'Example commit summary.',
      timestamp: new Date(
        new Date().getTime() - 1 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      hash: 'f36d7c0d556e30421a7a8f22038234a9174f0e04',
      summary: 'Example commit summary.',
      timestamp: new Date(
        new Date().getTime() - 2 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      hash: '6dda2682901bf4f2f03f936267169454120f1806',
      summary:
        'Example commit summary. With a long summary. Like really too long for a summary. Probably should use a shorter summary.',
      timestamp: new Date(
        new Date().getTime() - 4 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      hash: '465e3720c050f045d9500bd9bc7c7920f192db78',
      summary: 'Example commit summary.',
      timestamp: new Date(
        new Date().getTime() - 14 * 60 * 60 * 1000
      ).toISOString(),
    },
  ],
  url: 'preview.html',
  urls: [
    {
      url: '#private',
      label: 'Live editor preview',
      level: UrlLevel.PRIVATE,
    },
    {
      url: '#protected',
      label: 'Staging',
      level: UrlLevel.PROTECTED,
    },
    {
      url: '#public',
      label: 'Live',
      level: UrlLevel.PUBLIC,
    },
    {
      url: 'https://github.com/blinkkcode/live-edit/',
      label: 'View in Github',
      level: UrlLevel.SOURCE,
    },
  ],
};

const currentFileset: Array<FileData> = [
  {
    path: '/content/pages/index.yaml',
  },
  {
    path: '/static/img/portrait.png',
    url: 'image-portrait.png',
  },
];

const currentUsers: Array<UserData> = [
  {
    name: 'Example User',
    email: 'example@example.com',
  },
  {
    name: 'Domain users',
    email: '@domain.com',
    isGroup: true,
  },
];

let currentWorkspace: WorkspaceData = {
  branch: {
    name: 'main',
    commit: {
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      hash: '951c206e5f10ba99d13259293b349e321e4a6a9e',
      summary: 'Example commit summary.',
      timestamp: new Date().toISOString(),
    },
  },
  name: 'main',
};

const currentWorkspaces: Array<WorkspaceData> = [
  currentWorkspace,
  {
    branch: {
      name: 'staging',
      commit: {
        author: {
          name: 'Example User',
          email: 'example@example.com',
        },
        hash: '26506fd82b7d5d6aab6b3a92c7ef641c7073b249',
        summary: 'Example commit summary.',
        timestamp: new Date(
          new Date().getTime() - 2 * 60 * 60 * 1000
        ).toISOString(),
      },
    },
    name: 'staging',
  },
  {
    branch: {
      name: 'workspace/redesign',
      commit: {
        author: {
          name: 'Example User',
          email: 'example@example.com',
        },
        hash: 'db29a258dacdd416bb24bb63c689d669df08d409',
        summary: 'Example commit summary.',
        timestamp: new Date(
          new Date().getTime() - 6 * 60 * 60 * 1000
        ).toISOString(),
      },
    },
    name: 'redesign',
  },
];

/**
 * Example api that returns data through a 'simulated' network.
 */
export class GrowApi implements LiveEditorApiComponent {
  async copyFile(originalPath: string, path: string): Promise<FileData> {
    return new Promise<FileData>((resolve, reject) => {
      const newFile: FileData = {
        path: path,
      };
      currentFileset.push(newFile);
      resolve(newFile);
    });
  }

  async createFile(path: string): Promise<FileData> {
    return new Promise<FileData>((resolve, reject) => {
      const newFile: FileData = {
        path: path,
      };
      currentFileset.push(newFile);
      resolve(newFile);
    });
  }

  async createWorkspace(
    base: WorkspaceData,
    workspace: string
  ): Promise<WorkspaceData> {
    return new Promise<WorkspaceData>((resolve, reject) => {
      const newWorkspace: WorkspaceData = {
        branch: {
          name: `workspace/${workspace}`,
          commit: {
            author: base.branch.commit.author,
            hash: base.branch.commit.hash,
            message: base.branch.commit.message,
            summary: base.branch.commit.summary,
            timestamp: new Date().toISOString(),
          },
        },
        name: workspace,
      };
      currentWorkspaces.push(newWorkspace);
      resolve(newWorkspace);
    });
  }

  async deleteFile(file: FileData): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      for (let i = 0; i < currentFileset.length; i++) {
        if (currentFileset[i].path === file.path) {
          currentFileset.splice(i, 1);
          break;
        }
      }

      resolve(null);
    });
  }

  async getDevices(): Promise<Array<DeviceData>> {
    return new Promise<Array<DeviceData>>((resolve, reject) => {
      resolve([
        {
          label: 'Mobile',
          width: 411,
          height: 731,
          canRotate: true,
        } as DeviceData,
        {
          label: 'Tablet',
          width: 1024,
          height: 768,
          canRotate: true,
        } as DeviceData,
        {
          label: 'Desktop',
          width: 1440,
        } as DeviceData,
        {
          label: 'Desktop (Large)',
          width: 2200,
        } as DeviceData,
      ]);
    });
  }

  async getFile(file: FileData): Promise<EditorFileData> {
    return new Promise<EditorFileData>((resolve, reject) => {
      const url = new URL(window.location.toString());
      url.searchParams.set('path', file.path);
      window.history.pushState({}, '', url.toString());

      resolve(DEFAULT_EDITOR_FILE);
    });
  }

  async getFiles(): Promise<Array<FileData>> {
    return new Promise<Array<FileData>>((resolve, reject) => {
      resolve([...currentFileset]);
    });
  }

  async getFileUrl(file: FileData): Promise<FileData> {
    return new Promise<FileData>((resolve, reject) => {
      // TODO: Use some logic to determine what url to return.
      resolve({
        path: file.path,
        url: 'image-landscape.png',
      } as FileData);
    });
  }

  async getProject(): Promise<ProjectData> {
    return new Promise<ProjectData>((resolve, reject) => {
      resolve({
        title: 'Example project',
        publish: {},
      } as ProjectData);
    });
  }

  async getSite(): Promise<SiteData> {
    return new Promise<SiteData>((resolve, reject) => {
      resolve({});
    });
  }

  async getUsers(): Promise<Array<UserData>> {
    return new Promise<Array<UserData>>((resolve, reject) => {
      resolve([...currentUsers]);
    });
  }

  async getWorkspace(): Promise<WorkspaceData> {
    return new Promise<WorkspaceData>((resolve, reject) => {
      resolve(currentWorkspace);
    });
  }

  async getWorkspaces(): Promise<Array<WorkspaceData>> {
    return new Promise<Array<WorkspaceData>>((resolve, reject) => {
      resolve([...currentWorkspaces]);
    });
  }

  async loadWorkspace(workspace: WorkspaceData): Promise<WorkspaceData> {
    return new Promise<WorkspaceData>((resolve, reject) => {
      currentWorkspace = workspace;
      resolve(currentWorkspace);
    });
  }

  async publish(
    workspace: WorkspaceData,
    data?: Record<string, any>
  ): Promise<PublishResult> {
    return new Promise<PublishResult>((resolve, reject) => {
      const status: PublishStatus = PublishStatus.Complete;

      resolve({
        status: status,
        workspace: currentWorkspace,
      });
    });
  }

  async saveFile(file: EditorFileData): Promise<EditorFileData> {
    return new Promise<EditorFileData>((resolve, reject) => {
      resolve(DEFAULT_EDITOR_FILE);
    });
  }

  async uploadFile(file: File, meta?: Record<string, any>): Promise<FileData> {
    return new Promise<FileData>((resolve, reject) => {
      resolve({
        path: '/static/img/portrait.png',
        url: 'image-portrait.png',
      } as FileData);
    });
  }
}
