import {
  handleWebRedirectCallback,
  isAuthenticated,
  login,
} from '../services/oauthService.js';

class AuthPage extends HTMLElement {
  connectedCallback() {
    const hasSession = isAuthenticated();

    this.innerHTML = `
      <style>
        #container {
          max-width: 520px;
          margin: 0 auto;
        }

        ion-card-content {
          display: grid;
          gap: 12px;
        }

        .demo-note {
          margin: 0;
          color: var(--ion-color-medium);
          font-size: 0.9rem;
        }
      </style>
      <ion-header>
        <ion-toolbar>
          <ion-title>Authentication</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div id="container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Sign in</ion-card-title>
              <ion-card-subtitle>OAuth 2.0 flow</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              ${
                hasSession
                  ? '<ion-button id="profile-button">Open profile</ion-button>'
                  : '<ion-button id="login-button">Sign in</ion-button>'
              }
              <p class="demo-note">
                This demo uses your Auth0 account with the Capacitor OAuth plugin.
              </p>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    `;

    this.querySelector('#login-button')?.addEventListener('click', () => this.onLogin());
    this.querySelector('#profile-button')?.addEventListener('click', () =>
      this.goToProfile(),
    );

    this.tryHandleWebCallback();
  }

  async onLogin() {
    try {
      await login();
      this.goToProfile();
    } catch (error) {
      this.showToast(
        error?.message ?? 'Could not sign in. Please try again.',
      );
    }
  }

  async tryHandleWebCallback() {
    try {
      const result = await handleWebRedirectCallback();
      if (!result) {
        return;
      }
      this.goToProfile();
    } catch (error) {
      this.showToast(error?.message ?? 'Web authentication callback failed');
    }
  }

  goToProfile() {
    window.location.hash = '/profile';
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

customElements.define('auth-page', AuthPage);
