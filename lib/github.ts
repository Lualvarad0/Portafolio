export interface GitHubStats {
  public_repos: number;
  followers: number;
  public_gists: number;
}

export async function getGitHubStats(): Promise<GitHubStats> {
  try {
    const res = await fetch("https://api.github.com/users/Lualvarad0", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();
    return {
      public_repos: data.public_repos ?? 0,
      followers: data.followers ?? 0,
      public_gists: data.public_gists ?? 0,
    };
  } catch {
    return { public_repos: 0, followers: 0, public_gists: 0 };
  }
}
