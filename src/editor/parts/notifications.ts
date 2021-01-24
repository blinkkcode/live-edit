import {BasePart, Part} from '.';
import {DialogActionLevel, DialogModal} from '../ui/modal';
import {
  TemplateResult,
  expandClasses,
  html,
  repeat,
} from '@blinkk/selective-edit';
import {EVENT_NOTIFICATION} from '../events';
import {LiveEditor} from '../editor';

const MODAL_KEY_NOTIFICATIONS = 'notifications';

export enum NotificationLevel {
  Debug,
  Info,
  Warning,
  Error,
}

/**
 * Announcements can define actions that are available to the user.
 * These will appear as options for when the user views the notification
 * such as in a toast, a modal window, or the notifications view.
 *
 * For security cannot provide a callback, instead triggers a
 * custom event that contains additional details.
 */
export interface NotificationAction {
  label: string;
  customEvent: string;
  details?: Record<string, any>;
}

/**
 * When events or actions take place in the editor notifications
 * can be displayed to the user, often as a toast or for more
 * serious issues a modal window.
 *
 * Notifications are also stored temporarily for easy review of
 * recent notifications.
 */
export interface EditorNotification {
  /**
   * Actions that can be taken based on the notification.
   */
  actions?: Array<NotificationAction>;
  /**
   * Additional details that the user needs to know or possible
   * resolutions to an issue.
   */
  description?: string;
  /**
   * The level of priority to give the message. Lower priority
   * messages will be quickly displayed then disappear (like a toast).
   * Higher priority messages will display a modal to ensure it is
   * viewed.
   */
  level?: NotificationLevel;
  /**
   * Message to display to the user.
   */
  message: string;
}

/**
 * Used to track notification state in the notification part.
 */
interface InternalNotification extends EditorNotification {
  /**
   * Date the notification was added.
   */
  addedOn?: Date;
  /**
   * Is the notification expanded?
   */
  isExpanded?: boolean;
  /**
   * Has the notification been read by the user?
   */
  isRead?: boolean;
  /**
   * Some sub-notification types have addition properties.
   */
  [x: string]: any;
}

/**
 * Modals are centralized in the display to be outside of other
 * modals and structures. Modal windows live as siblings in the
 * DOM.
 *
 * This helps to prevent issues where one modal is clipping
 * another without having to pass the modal through the template
 * stack to be outside of another modal.
 *
 * This also allows reuse of modals across parts of the editor.
 */
export class NotificationsPart extends BasePart implements Part {
  protected notifications: Array<InternalNotification>;

  constructor() {
    super();
    this.notifications = [];

    document.addEventListener(EVENT_NOTIFICATION, (evt: Event) => {
      this.addInfo((evt as CustomEvent).detail);
      this.render();
    });
  }

  addDebug(notification: EditorNotification) {
    this.notifications.push(
      this.scrubNewNotification(notification, NotificationLevel.Debug)
    );
  }

  addError(notification: EditorNotification) {
    this.notifications.push(
      this.scrubNewNotification(notification, NotificationLevel.Error)
    );
  }

  addInfo(notification: EditorNotification) {
    this.notifications.push(
      this.scrubNewNotification(notification, NotificationLevel.Info)
    );
  }

  addWarning(notification: EditorNotification) {
    this.notifications.push(
      this.scrubNewNotification(notification, NotificationLevel.Warning)
    );
  }

  classesForPart(): Array<string> {
    const classes = ['le__part__notifications', 'le__clickable'];

    if (this.hasUnreadNotificationsAtLevel(NotificationLevel.Error)) {
      classes.push('le__part__notifications--errors');
    }

    return classes;
  }

  protected getOrCreateModalNotifications(editor: LiveEditor): DialogModal {
    if (!editor.parts.modals.modals[MODAL_KEY_NOTIFICATIONS]) {
      const modal = new DialogModal({
        title: 'Notifications',
      });
      modal.templateModal = this.templateNotifications.bind(this);
      modal.actions.push({
        label: 'Mark all read',
        level: DialogActionLevel.Primary,
        isDisabledFunc: () => false,
        onClick: () => {
          this.markAllAsRead();
          modal.hide();
        },
      });
      modal.addCancelAction('Close');
      editor.parts.modals.modals[MODAL_KEY_NOTIFICATIONS] = modal;
    }
    return editor.parts.modals.modals[MODAL_KEY_NOTIFICATIONS] as DialogModal;
  }

  getIconForNotificationLevel(level: NotificationLevel, isRead: boolean) {
    if (level === NotificationLevel.Error) {
      return 'notification_important';
    }
    if (!isRead) {
      return 'notifications_active';
    }
    return 'notifications';
  }

  get hasUnreadNotifications() {
    for (const notification of this.notifications) {
      if (!notification.isRead) {
        return true;
      }
    }
    return false;
  }

  hasUnreadNotificationsAtLevel(level: NotificationLevel) {
    for (const notification of this.notifications) {
      if (!notification.level) {
        continue;
      }

      if (!notification.isRead && notification.level >= level) {
        return true;
      }
    }
    return false;
  }

  markAllAsRead() {
    for (const notification of this.notifications) {
      notification.isRead = true;
    }
  }

  protected scrubNewNotification(
    notification: EditorNotification,
    defaultLevel: NotificationLevel
  ): InternalNotification {
    const internalNotification: InternalNotification = notification;
    if (!internalNotification.level) {
      internalNotification.level = defaultLevel;
    }
    internalNotification.addedOn = new Date();
    internalNotification.isRead = false;
    return internalNotification;
  }

  template(editor: LiveEditor): TemplateResult {
    let icon = 'notifications';

    if (this.hasUnreadNotificationsAtLevel(NotificationLevel.Error)) {
      icon = 'notification_important';
    } else if (this.hasUnreadNotifications) {
      icon = 'notifications_active';
    }

    const handleOpenNotifications = () => {
      const modal = this.getOrCreateModalNotifications(editor);
      modal.show();
    };

    return html`<div
      class=${expandClasses(this.classesForPart())}
      @click=${handleOpenNotifications}
    >
      <span class="material-icons">${icon}</span>
    </div>`;
  }

  templateNotification(
    editor: LiveEditor,
    notification: InternalNotification
  ): TemplateResult {
    let markReadButton = html``;
    if (!notification.isRead) {
      markReadButton = html`<div
        class="le__clickable"
        @click=${(evt: Event) => {
          evt.stopPropagation();
          notification.isRead = true;
          this.render();
        }}
      >
        Mark read
      </div>`;
    }

    const handleClick = (evt: Event) => {
      evt.stopPropagation();
      notification.isExpanded = !notification.isExpanded;
      this.render();
    };

    return html`<div
        class="le__list__item le__list__item--pad_horizontal le__clickable"
        @click=${handleClick}
      >
        <div class="le__list__item__icon">
          <span class="material-icons"
            >${notification.isExpanded
              ? 'arrow_drop_down'
              : 'arrow_right'}</span
          >
        </div>
        <div class="le__list__item__icon">
          <span class="material-icons"
            >${this.getIconForNotificationLevel(
              notification.level || NotificationLevel.Info,
              notification.isRead || false
            )}</span
          >
        </div>
        <div class="le__list__item__label">${notification.message}</div>
        <div class="le__list__item__aside ">${markReadButton}</div>
      </div>
      ${this.templateNotificationDetails(editor, notification)}
      ${this.templateNotificationMeta(editor, notification)}`;
  }

  templateNotificationDetails(
    editor: LiveEditor,
    notification: InternalNotification
  ): TemplateResult {
    let additionalDetails = html``;

    if (notification.isExpanded) {
      additionalDetails = html`<div
        class="le__list__item le__list__item--pad_horizontal le__list__item--indent_large"
      >
        <div class="le__list__item__label">${notification.description}</div>
      </div>`;
    }

    return additionalDetails;
  }

  templateNotificationMeta(
    editor: LiveEditor,
    notification: InternalNotification
  ): TemplateResult {
    let additionalDetails = html``;

    if (notification.isExpanded && notification.meta) {
      additionalDetails = html`<div
        class="le__list__item le__list__item--constrained le__list__item--pad_horizontal le__list__item--indent_large"
      >
        <div class="le__list__item__label">
          <pre><code>${JSON.stringify(notification.meta, null, 2)}</code></pre>
        </div>
      </div>`;
    }

    return additionalDetails;
  }

  templateNotifications(editor: LiveEditor): TemplateResult {
    if (!this.notifications.length) {
      return html`<div class="le__part__notifications__modal">
        <div class="le__list">
          <div class="le__list__item le__list__item--pad">
            <div class="le__list__item__icon">
              <span class="material-icons">check</span>
            </div>
            <div class="le__list__item__label">
              No notifications yet. Please check back later.
            </div>
          </div>
        </div>
      </div>`;
    }

    // Sort notifications by the timestamp in latest first.
    this.notifications.sort(
      (a, b) => (b.addedOn?.getTime() || 0) - (a.addedOn?.getTime() || 0)
    );

    return html`<div class="le__part__notifications__modal">
      <div class="le__list">
        ${repeat(
          this.notifications,
          notification => notification.addedOn?.getUTCDate(),
          (notification: InternalNotification) =>
            this.templateNotification(editor, notification)
        )}
      </div>
    </div>`;
  }
}

export function announceNotification(notification: EditorNotification) {
  document.dispatchEvent(
    new CustomEvent(EVENT_NOTIFICATION, {detail: notification})
  );
}