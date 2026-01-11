# Windows Setup Instructions

## Fix PowerShell Script Execution Error

If you see this error:
> npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.

You need to enable script execution in PowerShell:

1. Open PowerShell as Administrator.
2. Run the following command:

   Set-ExecutionPolicy RemoteSigned

3. Type `Y` and press Enter to confirm.

This allows local scripts to run and signed scripts from the internet. You can now use npm and other scripts in this project.

## Node Version Manager (nvm)

To use the correct Node.js version (see .nvmrc):

1. Install nvm for Windows: https://github.com/coreybutler/nvm-windows
2. Open a new terminal in your project folder.
3. Run:

   nvm install 22.12.0
   nvm use 22.12.0

Now `node --version` should show 22.12.0.
