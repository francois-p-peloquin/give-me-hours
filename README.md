# Give Me Hours - give-me-hours script

A command-line tool to list out hours worked based on git log hours in a working directory.

## Installation

### Method 1: Homebrew Formula (Recommended)
   ```bash
   # Add your tap
   brew tap francois-p-peloquin/tap

   # Install the package
   brew install give-me-hours
   ```

### Method 2: Direct Installation (For testing purposes)
   ```bash
   # Download the script
   curl -o give-me-hours https://raw.githubusercontent.com/francois-p-peloquin/give-me-hours/main/give-me-hours

   # Make it executable
   chmod +x give-me-hours

   # Move to a directory in your PATH (e.g., /usr/local/bin)
   sudo mv give-me-hours /usr/local/bin/
   ```

## Usage

Navigate to your work directory (eg `~/Web/`) containing multiple git repositories and run:

```bash
# Show today's hours
give-me-hours

# Show yesterday's hours
give-me-hours yesterday

# Show hours for a specific date
give-me-hours 2024-08-22

# Save output to CSV file
give-me-hours today --file

# Show help
give-me-hours --help
```

## Prerequisites

1. **Git configuration:**
   ```bash
   git config --global user.name "Your Name"
   ```

## Features

- **Cross-platform compatibility** (macOS, Linux)
- **Improved argument parsing** with proper error handling
- **Better table formatting** with Unicode box drawing characters
- **Dependency checking** with helpful error messages
- **Temporary file cleanup** for better system hygiene
- **Sorted output** for consistent repository ordering

## Example Output

```
Git username: John Doe

Getting hours from 2024-08-22 00:00:00 to 2024-08-22 23:59:59

┌──────────────────────────────────────────┬────────────┐
│ Repository                               │ Hours      │
├──────────────────────────────────────────┼────────────┤
│ my-awesome-project                       │ 2h30m15s   │
│ another-repo                             │ 1h45m30s   │
│ weekend-project                          │ 3h15m45s   │
└──────────────────────────────────────────┴────────────┘
```

## Creating a new release on Homebrew

1. **Create a new release on Github** with a version number and new tag (eg `v1.0.9`).
2. **Update `Formula/give-me-hours.sh`** with the latest `url`, `version`, and `sha256` variables.
```bash
  # Grab the latest SHA256 variable
  curl -sL https://github.com/francois-p-peloquin/give-me-hours/archive/v1.0.9.tar.gz | shasum -a 256
```
3. **Copy `Formula/give-me-hours.sh` to your homebrew-tap** repo.
```bash
  # In the working directory
  cp ./Formula/give-me-hours.rb ../homebrew-tap/Formula/give-me-hours.rb
```
4. **Re-submit to Homebrew** forcefully.
```bash
  # Remove the tap completely
  brew untap francois-p-peloquin/tap

  # Clear Homebrew cache
  brew cleanup --prune=all

  # Re-add the tap
  brew tap francois-p-peloquin/tap

  # Verify the formula is updated
  brew info francois-p-peloquin/tap/give-me-hours
```
5. **Clear the Homebrew cache and reinstall** on your machine
```bash
  # Install or upgrade
  brew upgrade give-me-hours
  brew install give-me-hours
```

## Notes

- The tool looks for git repositories in the current directory (one level deep)
- Requires `git-hours` npm package to be installed globally
- Works with any directory structure containing multiple git repos
- Cross-platform date handling for macOS and Linux
