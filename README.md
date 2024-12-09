# History Access Security Chrome Extension

This Chrome extension adds an extra layer of security to the history tab by requiring a **PIN** to access it. The user sets up a **master password** only during the initial setup, which is used to secure the PIN configuration. The PIN is hashed and stored in the browser's local storage, ensuring that unauthorized users cannot easily bypass the security.

## Features

- **Master Password Setup**: Set up a master password only during the initial extension setup.
- **PIN Setup**: Set a secure PIN for accessing the history tab.
- **Secure PIN Authentication**: The PIN is hashed and stored securely. It must be entered to access the history tab.
- **Access Control**: Unauthorized users are prompted for the correct PIN before accessing the history.
