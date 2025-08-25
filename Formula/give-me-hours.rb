class GiveMeHours < Formula
  desc "Track git commit hours across multiple repositories with commit summarization"
  homepage "https://github.com/francois-p-peloquin/give-me-hours"
  url "https://github.com/francois-p-peloquin/give-me-hours/archive/refs/tags/v1.0.1.tar.gz"
  sha256 "a2e3f894961963b2d04fe5e3a8bd569af42efb8f802a828830111104e70086d7"
  version "1.0.1"
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
      system "npm", "install", "--production"
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
