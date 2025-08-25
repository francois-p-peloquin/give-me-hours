class GiveMeHours < Formula
  desc "Track git commit hours across multiple repositories with commit summarization"
  homepage "https://github.com/francois-p-peloquin/give-me-hours"
  url "https://github.com/francois-p-peloquin/give-me-hours/archive/refs/tags/v1.0.3.tar.gz"
  sha256 "ae9169ddf4fb170542a4ea159ba2db2a66947593543fbdd552cd1b2e94001e22"
  version "1.0.3"
  license "MIT"

  depends_on "git"
  depends_on "node"
  depends_on "bc"

  def install
    bin.install "give-me-hours"

    # Install lib directory with Node.js summarization service
    lib.install Dir["lib/*"]

    # Install Node.js dependencies for summarization
    cd lib do
      system "npm", "install", "--omit=dev"
    end
  end

  def caveats
    <<~EOS
      Make sure your git global username is set:
      git config --global user.name "Your Name"

      Summary feature requires Node.js dependencies which have been installed automatically.

      Usage examples:
        give-me-hours today
        give-me-hours yesterday --summary
        give-me-hours 2024-01-15 --file
        give-me-hours 2025-08-15 --hours-rounding 0.5 --padding-before 0.25
    EOS
  end

  test do
    system "#{bin}/give-me-hours", "--help"
  end
end
