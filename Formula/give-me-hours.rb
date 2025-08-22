class GiveMeHours < Formula
  desc "Track git commit hours across multiple repositories"
  homepage "https://github.com/francois-p-peloquin/give-me-hours"
  url "https://github.com/francois-p-peloquin/give-me-hours/archive/v1.0.0.tar.gz"
  sha256 "your-sha256-hash-here"
  license "MIT"

  depends_on "git"
  depends_on "git-hours" => :optional

  def install
    bin.install "give-me-hours"
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
