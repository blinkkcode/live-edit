import {
  FileData,
  LiveEditorApiComponent,
  ProjectData,
  UserData,
  WorkspaceData,
} from './editor/api';

const MAX_RESPONSE_MS = 1500;
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

/**
 * Example api that returns data through a 'simulated' network.
 */
export class ExampleApi implements LiveEditorApiComponent {
  getFiles(): Promise<Array<FileData>> {
    return new Promise<Array<FileData>>(resolve => {
      simulateNetwork(resolve, [
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
      ]);
    });
  }

  getProject(): Promise<ProjectData> {
    return new Promise<ProjectData>(resolve => {
      simulateNetwork(resolve, {
        title: 'Example project',
      });
    });
  }

  getUsers(): Promise<Array<UserData>> {
    return new Promise<Array<UserData>>(resolve => {
      simulateNetwork(resolve, [
        {
          name: 'Example User',
          email: 'example@example.com',
        },
        {
          name: 'Domain users',
          email: '@domain.com',
          isGroup: true,
        },
      ]);
    });
  }

  getWorkspace(): Promise<WorkspaceData> {
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

  getWorkspaces(): Promise<Array<WorkspaceData>> {
    return new Promise<Array<WorkspaceData>>(resolve => {
      simulateNetwork(resolve, [
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
      ]);
    });
  }
}
