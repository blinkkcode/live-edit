import {
  FileData,
  LiveEditorApiComponent,
  ProjectData,
  UserData,
  WorkspaceData,
} from './editor/api';

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
    shortcutPath: '/pages/index.yaml',
  },
  {
    path: '/content/pages/about.yaml',
    shortcutPath: '/pages/about.yaml',
  },
  {
    path: '/content/strings/about.yaml',
    shortcutPath: '/strings/products.yaml',
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

const currentWorkspaces: Array<WorkspaceData> = [
  {
    branch: {
      name: 'main',
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      commit: '951c206e5f10ba99d13259293b349e321e4a6a9e',
      commitSummary: 'Example commit summary.',
    },
    name: 'main',
  },
  {
    branch: {
      name: 'staging',
      author: {
        name: 'Example User',
        email: 'example@example.com',
      },
      commit: '26506fd82b7d5d6aab6b3a92c7ef641c7073b249',
      commitSummary: 'Example commit summary.',
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
    },
    name: 'redesign',
  },
];

/**
 * Example api that returns data through a 'simulated' network.
 */
export class ExampleApi implements LiveEditorApiComponent {
  async copyFile(originalPath: string, path: string): Promise<FileData> {
    return new Promise<FileData>(resolve => {
      console.log('API: copyFile', originalPath, path);

      const newFile: FileData = {
        path: path,
      };
      currentFileset.push(newFile);
      simulateNetwork(resolve, newFile);
    });
  }

  async createFile(path: string): Promise<FileData> {
    return new Promise<FileData>(resolve => {
      console.log('API: createFile', path);

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
    return new Promise<WorkspaceData>(resolve => {
      console.log('API: createWorkspace', base, workspace);

      const newWorkspace: WorkspaceData = {
        branch: {
          name: `workspace/${workspace}`,
          commit: base.branch.commit,
          commitSummary: base.branch.commitSummary,
          author: base.branch.author,
        },
        name: workspace,
      };
      currentWorkspaces.push(newWorkspace);
      simulateNetwork(resolve, newWorkspace);
    });
  }

  async deleteFile(path: string): Promise<null> {
    return new Promise<null>(resolve => {
      console.log('API: deleteFile', path);

      for (let i = 0; i < currentFileset.length; i++) {
        if (currentFileset[i].path === path) {
          currentFileset.splice(i, 1);
          break;
        }
      }

      simulateNetwork(resolve, null);
    });
  }

  async getFiles(): Promise<Array<FileData>> {
    return new Promise<Array<FileData>>(resolve => {
      simulateNetwork(resolve, [...currentFileset]);
    });
  }

  async getProject(): Promise<ProjectData> {
    return new Promise<ProjectData>(resolve => {
      simulateNetwork(resolve, {
        title: 'Example project',
      });
    });
  }

  async getUsers(): Promise<Array<UserData>> {
    return new Promise<Array<UserData>>(resolve => {
      simulateNetwork(resolve, [...currentUsers]);
    });
  }

  async getWorkspace(): Promise<WorkspaceData> {
    return new Promise<WorkspaceData>(resolve => {
      simulateNetwork(resolve, {
        branch: {
          name: 'main',
          author: {
            name: 'Example User',
            email: 'example@example.com',
          },
          commit: '951c206e5f10ba99d13259293b349e321e4a6a9e',
          commitSummary: 'Example commit summary.',
        },
        name: 'main',
      });
    });
  }

  async getWorkspaces(): Promise<Array<WorkspaceData>> {
    return new Promise<Array<WorkspaceData>>(resolve => {
      simulateNetwork(resolve, [...currentWorkspaces]);
    });
  }
}
