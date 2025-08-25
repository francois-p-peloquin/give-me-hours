class GiveMeHours < Formula
  desc "Track git commit hours across multiple repositories"
  homepage "https://github.com/francois-p-peloquin/give-me-hours"
  url "https://github.com/francois-p-peloquin/give-me-hours/archive/refs/tags/v1.0.1.tar.gz"
  sha256 "a2e3f894961963b2d04fe5e3a8bd569af42efb8f802a828830111104e70086d7"
  version "1.0.1"
  license "MIT"

  depends_on "git"

  def install
    bin.install "give-me-hours"
    lib.install "summarize.js" if build.with?("node")
  end

  def caveats
    <<~EOS
      This tool requires git-hours to be installed.
      Install it with: npm install -g git-hours

      Make sure your git global username is set:
      git config --global user.name "Your Name"
    EOS
  end

  test do
    system "#{bin}/give-me-hours", "--help"
  end
end
