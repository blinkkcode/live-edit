import {
  ApiError,
  DeviceData,
  EditorFileData,
  EditorUrlLevel,
  FileData,
  LiveEditorApiComponent,
  ProjectData,
  UserData,
  WorkspaceData,
} from '../editor/api';
import {FieldConfig} from '@blinkk/selective-edit/dist/src/selective/field';

const MAX_RESPONSE_MS = 1200;
const MIN_RESPONSE_MS = 250;

/**
 * Simulate having the request be slowed down by a network.
 *
 * @param callback Callback after 'network' lag complete.
 * @param response Response for the callback.
 */
function simulateNetwork(callback: Function, response: any) {
  setTimeout(() => {
    callback(response);
  }, Math.random() * (MAX_RESPONSE_MS - MIN_RESPONSE_MS) + MIN_RESPONSE_MS);
}

const currentFileset: Array<FileData> = [
  {
    path: '/content/pages/index.yaml',
  },
  {
    path: '/content/pages/about.yaml',
  },
  {
    path: '/content/pages/sub/page.yaml',
  },
  {
    path: '/content/pages/sub/another.yaml',
  },
  {
    path: '/content/strings/about.yaml',
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
    author: {
      name: 'Example User',
      email: 'example@example.com',
    },
    commit: '951c206e5f10ba99d13259293b349e321e4a6a9e',
    commitSummary: 'Example commit summary.',
    timestamp: new Date().toISOString(),
  },
  name: 'main',
};

const currentWorkspaces: Array<WorkspaceData> = [
  currentWorkspace,
  {
    branch: {
      name: 'staging',
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      commit: '26506fd82b7d5d6aab6b3a92c7ef641c7073b249',
      commitSummary: 'Example commit summary.',
      timestamp: new Date(
        new Date().getTime() - 2 * 60 * 60 * 1000
      ).toISOString(),
    },
    name: 'staging',
  },
  {
    branch: {
      name: 'workspace/redesign',
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      commit: 'db29a258dacdd416bb24bb63c689d669df08d409',
      commitSummary: 'Example commit summary.',
      timestamp: new Date(
        new Date().getTime() - 6 * 60 * 60 * 1000
      ).toISOString(),
    },
    name: 'redesign',
  },
];

/**
 * Example api that returns data through a 'simulated' network.
 */
export class ExampleApi implements LiveEditorApiComponent {
  errorController: ErrorController;

  constructor() {
    this.errorController = new ErrorController();
  }

  async copyFile(originalPath: string, path: string): Promise<FileData> {
    return new Promise<FileData>((resolve, reject) => {
      const methodName = 'copyFile';
      console.log(`API: ${methodName}`, originalPath, path);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to copy the file.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      const newFile: FileData = {
        path: path,
      };
      currentFileset.push(newFile);
      simulateNetwork(resolve, newFile);
    });
  }

  async createFile(path: string): Promise<FileData> {
    return new Promise<FileData>((resolve, reject) => {
      const methodName = 'createFile';
      console.log(`API: ${methodName}`, path);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to create the file.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      const newFile: FileData = {
        path: path,
      };
      currentFileset.push(newFile);
      simulateNetwork(resolve, newFile);
    });
  }

  async createWorkspace(
    base: WorkspaceData,
    workspace: string
  ): Promise<WorkspaceData> {
    return new Promise<WorkspaceData>((resolve, reject) => {
      const methodName = 'createWorkspace';
      console.log(`API: ${methodName}`, base, workspace);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to create the workspace.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      const newWorkspace: WorkspaceData = {
        branch: {
          name: `workspace/${workspace}`,
          commit: base.branch.commit,
          commitSummary: base.branch.commitSummary,
          author: base.branch.author,
          timestamp: new Date().toISOString(),
        },
        name: workspace,
      };
      currentWorkspaces.push(newWorkspace);
      simulateNetwork(resolve, newWorkspace);
    });
  }

  async deleteFile(file: FileData): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      const methodName = 'deleteFile';
      console.log(`API: ${methodName}`, file.path);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to delete the file.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      for (let i = 0; i < currentFileset.length; i++) {
        if (currentFileset[i].path === file.path) {
          currentFileset.splice(i, 1);
          break;
        }
      }

      simulateNetwork(resolve, null);
    });
  }

  async getDevices(): Promise<Array<DeviceData>> {
    return new Promise<Array<DeviceData>>((resolve, reject) => {
      const methodName = 'getDevices';
      console.log(`API: ${methodName}`);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to get the devices.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      simulateNetwork(resolve, [
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

  async getFiles(): Promise<Array<FileData>> {
    return new Promise<Array<FileData>>((resolve, reject) => {
      const methodName = 'getFiles';
      console.log(`API: ${methodName}`);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to get the files.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      simulateNetwork(resolve, [...currentFileset]);
    });
  }

  async getProject(): Promise<ProjectData> {
    return new Promise<ProjectData>((resolve, reject) => {
      const methodName = 'getProject';
      console.log(`API: ${methodName}`);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to get the project.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      simulateNetwork(resolve, {
        title: 'Example project',
      });
    });
  }

  async getUsers(): Promise<Array<UserData>> {
    return new Promise<Array<UserData>>((resolve, reject) => {
      const methodName = 'getUsers';
      console.log(`API: ${methodName}`);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to get the users.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      simulateNetwork(resolve, [...currentUsers]);
    });
  }

  async getWorkspace(): Promise<WorkspaceData> {
    return new Promise<WorkspaceData>((resolve, reject) => {
      const methodName = 'getWorkspace';
      console.log(`API: ${methodName}`);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to get the workspace.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      simulateNetwork(resolve, currentWorkspace);
    });
  }

  async getWorkspaces(): Promise<Array<WorkspaceData>> {
    return new Promise<Array<WorkspaceData>>((resolve, reject) => {
      const methodName = 'getWorkspaces';
      console.log(`API: ${methodName}`);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to get the workspaces.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      simulateNetwork(resolve, [...currentWorkspaces]);
    });
  }

  async loadFile(file: FileData): Promise<EditorFileData> {
    return new Promise<EditorFileData>((resolve, reject) => {
      const methodName = 'loadFile';
      console.log(`API: ${methodName}`, file);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to load the file.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      // TODO: Make the fields for each file dynamic for the example.
      simulateNetwork(resolve, {
        data: {
          title: 'Testing',
        },
        file: file,
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
            } as FieldConfig,
          ],
        },
        urls: [
          {
            url: '#private',
            label: 'Live editor preview',
            level: EditorUrlLevel.PRIVATE,
          },
          {
            url: '#protected',
            label: 'Staging',
            level: EditorUrlLevel.PROTECTED,
          },
          {
            url: '#public',
            label: 'Live',
            level: EditorUrlLevel.PUBLIC,
          },
        ],
      } as EditorFileData);
    });
  }

  async loadWorkspace(workspace: WorkspaceData): Promise<WorkspaceData> {
    return new Promise<WorkspaceData>((resolve, reject) => {
      const methodName = 'loadWorkspace';
      console.log(`API: ${methodName}`, workspace.name);

      if (this.errorController.shouldError(methodName)) {
        reject({
          message: 'Failed to load the workspaces.',
          description: 'Api is set to always return an error.',
        } as ApiError);
        return;
      }

      currentWorkspace = workspace;

      simulateNetwork(resolve, currentWorkspace);
    });
  }
}

export class ErrorController {
  errorMethods: Set<string>;

  constructor() {
    this.errorMethods = new Set();
  }

  makeError(methodName: string) {
    return this.errorMethods.add(methodName);
  }

  makeSuccess(methodName: string) {
    return this.errorMethods.delete(methodName);
  }

  shouldError(methodName: string) {
    return this.errorMethods.has(methodName);
  }

  toggleError(methodName: string) {
    if (this.errorMethods.has(methodName)) {
      this.errorMethods.delete(methodName);
    } else {
      this.errorMethods.add(methodName);
    }
  }
}
