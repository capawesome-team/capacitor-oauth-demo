class HomePage extends HTMLElement {
  eventData = {};
  connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-title>Demo App</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div id="container">
          <p>
            <pre>Hello World</pre>
          </p>
        </div>
      </ion-content>
    `;
  }
}

customElements.define('home-page', HomePage);
