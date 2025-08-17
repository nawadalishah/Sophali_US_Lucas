# Sophali Merchant App

## Project Setup & Running

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the project:**
   ```bash
   npx expo start
   # or
   yarn expo start
   ```
   - This will launch the Expo Dev Tools in your browser. You can run the app on an emulator, simulator, or your physical device using the Expo Go app.

## Upgrading Expo

1. **Upgrade Expo SDK:**
   ```bash
   npx expo install expo@latest
   npx expo install --fix
   # or
   yarn expo nstall expo@latest
   yarn expo install --fix
   ```
   - Follow the prompts to upgrade to the latest compatible Expo SDK version.

2. **Update dependencies:**
   ```bash
   npx expo install
   # or
   yarn expo install
   ```
   - This ensures all Expo-related packages are compatible with the new SDK version.

3. **Test your app thoroughly after upgrading.**

4. **Check project health:**
   ```bash
   npx expo-doctor
   ```
   - Always run this command after upgrading or installing dependencies to ensure everything is normal and there are no issues with your Expo setup.

## EAS Login & Builds

1. **Login with EAS:**
   ```bash
   npx eas login
   ```
   - Follow the prompts to log in with your Expo account.

2. **Create a development build:**
   ```bash
   npx eas build --profile development --platform all
   ```
   - This will create a development build for both iOS and Android. You can specify `--platform ios` or `--platform android` for a single platform.

3. **Create a production build:**
   ```bash
   npx eas build --profile production --platform all
   ```
   - This will create a production build for both iOS and Android. You can specify `--platform ios` or `--platform android` for a single platform.

For more details, see the [EAS Build documentation](https://docs.expo.dev/build/introduction/).

## Environment URLs

- **Staging:** Uses URLs starting with `https://147` (e.g., `https://147.x.x.x`)
- **Production:** Uses URLs starting with `https://147` (e.g., `https://147.x.x.xx9`)

---

# (Add further project-specific documentation below)
