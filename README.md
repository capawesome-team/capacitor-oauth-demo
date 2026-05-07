# Handling OAuth in Capacitor Apps the Correct Way

Simple Capacitor app to demonstrate the use of the [OAuth plugin](https://capawesome.io/docs/plugins/oauth/). Source code for the step-by-step [video tutorial](https://www.youtube.com/watch?v=Cr1dJNN6Urw).



## How to run it
```bash
npm run dev
```


## How to add native platforms
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init

npm run build

npx cap add ios
npx cap add android
```


## How to install the OAuth plugin

This plugin is only available to [Capawesome Insiders](https://capawesome.io/insiders/).
First, make sure you have the Capawesome npm registry set up. You can do this by running the following commands:


```bash
npm config set @capawesome-team:registry https://npm.registry.capawesome.io
npm config set //npm.registry.capawesome.io/:_authToken <YOUR_LICENSE_KEY>
```

And then install the plugin and sync to native projects:
```bash
npm install @capawesome-team/capacitor-oauth
npx cap sync
```