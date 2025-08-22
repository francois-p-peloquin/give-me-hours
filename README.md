# give-me-hours Homebrew Package

A command-line tool to track git commit hours across multiple repositories in the current directory.

## Installation

### Method 1: Direct Installation (Recommended for testing)

1. **Install git-hours dependency:**
   ```bash
   npm install -g git-hours
   ```

2. **Download and install the script:**
   ```bash
   # Download the script
   curl -o give-me-hours https://raw.githubusercontent.com/yourusername/give-me-hours/main/give-me-hours

   # Make it executable
   chmod +x give-me-hours

   # Move to a directory in your PATH (e.g., /usr/local/bin)
   sudo mv give-me-hours /usr/local/bin/
   ```

### Method 2: Homebrew Formula (For distribution)

1. **Create a GitHub repository** with the following structure:
   ```
   give-me-hours/
   ├── give-me-hours           # The executable script
   ├── Formula/
   │   └── give-me-hours.rb    # The Homebrew formula
   ├── README.md
   └── LICENSE
   ```

2. **Create a Homebrew tap:**
   ```bash
   # Create your own tap repository
   git clone https://github.com/yourusername/homebrew-tap.git
   cd homebrew-tap

   # Add the formula
   cp give-me-hours.rb Formula/
   git add . && git commit -m "Add give-me-hours formula"
   git push
   ```

3. **Install via Homebrew:**
   ```bash
   # Add your tap
   brew tap yourusername/tap

   # Install the package
   brew install give-me-hours
   ```

## Prerequisites

1. **Git configuration:**
   ```bash
   git config --global user.name "Your Name"
   ```

2. **git-hours dependency:**
   ```bash
   npm install -g git-hours
   ```

## Usage

Navigate to a directory containing multiple git repositories and run:

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

## Distribution Steps

1. **Create the GitHub repository** with the script and formula
2. **Tag a release:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. **Update the formula** with the correct URL and SHA256 hash
4. **Test the installation** on a clean system
5. **Submit to Homebrew** (optional) or distribute via your own tap

## Notes

- The tool looks for git repositories in the current directory (one level deep)
- Requires `git-hours` npm package to be installed globally
- Works with any directory structure containing multiple git repos
- Cross-platform date handling for macOS and Linux
