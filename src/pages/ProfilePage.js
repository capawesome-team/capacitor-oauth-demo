import { Capacitor } from '@capacitor/core';
import {
  getUserProfile,
  isAuthenticated,
  logout,
  refreshSession,
} from '../services/oauthService.js';

class ProfilePage extends HTMLElement {
  profile = null;

  connectedCallback() {
    this.initialize();
  }

  async initialize() {
    if (!isAuthenticated()) {
      window.location.hash = '/auth';
      return;
    }
    this.profile = await getUserProfile();
    this.render();
    this.registerActions();
  }

  render() {
    const displayName = this.profile?.name || 'Name not available';
    const displayEmail = this.profile?.email || 'Email not available';
    const avatarInitial = (this.profile?.name || this.profile?.email || '?')
      .trim()
      .charAt(0)
      .toUpperCase();

    this.innerHTML = `
      <style>
        #container {
          max-width: 760px;
          margin: 0 auto;
          display: grid;
          gap: 16px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          align-items: center;
          margin-bottom: 14px;
        }

        .avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--ion-color-primary);
          background: rgba(var(--ion-color-primary-rgb), 0.14);
        }

        .profile-name {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 600;
        }

        .profile-email {
          margin: 0;
          color: var(--ion-color-medium);
          font-size: 0.92rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
          margin-top: 8px;
        }

        .info-item {
          background: var(--ion-color-light);
          border-radius: 10px;
          padding: 10px;
        }

        .info-label {
          margin: 0;
          color: var(--ion-color-medium);
          font-size: 0.8rem;
        }

        .info-value {
          margin: 4px 0 0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
        }
      </style>
      <ion-header>
        <ion-toolbar>
          <ion-title>Profile</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div id="container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>User profile</ion-card-title>
              <ion-card-subtitle>Authenticated session</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <div class="profile-grid">
                <div class="avatar">${avatarInitial}</div>
                <div>
                  <p class="profile-name">${displayName}</p>
                  <p class="profile-email">${displayEmail}</p>
                </div>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <p class="info-label">Platform</p>
                  <p class="info-value">${Capacitor.getPlatform()}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Status</p>
                  <p class="info-value">Connected</p>
                </div>
              </div>
              <div class="actions">
                <ion-button id="refresh-button" fill="outline">Refresh session</ion-button>
                <ion-button id="logout-button" color="medium" fill="clear">Logout</ion-button>
                <ion-button id="auth-button" fill="clear">Back to auth</ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    `;
  }

  registerActions() {
    this.querySelector('#auth-button')?.addEventListener('click', () => {
      window.location.hash = '/auth';
    });
    this.querySelector('#refresh-button')?.addEventListener('click', () =>
      this.refreshToken(),
    );
    this.querySelector('#logout-button')?.addEventListener('click', () =>
      this.logout(),
    );
  }

  async refreshToken() {
    try {
      await refreshSession();
      this.profile = await getUserProfile();
      this.render();
      this.registerActions();
      this.showToast('Session refreshed');
    } catch (error) {
      this.showToast(error?.message ?? 'Could not refresh the session');
    }
  }

  async logout() {
    try {
      await logout();
    } catch (_error) {
      // Some providers may return USER_CANCELED on logout redirect.
    }

    window.location.hash = '/auth';
  }

  async showToast(message) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 1800;
    toast.position = 'bottom';
    document.body.appendChild(toast);
    await toast.present();
  }
}

customElements.define('profile-page', ProfilePage);
