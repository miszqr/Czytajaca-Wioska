#!/usr/bin/env python3
"""Publish an image to GitHub without printing its bytes or Base64 to an AI chat.

Standard-library only. Run from a checked-out Czytajaca-Wioska repository.
"""

import argparse
import base64
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REPOSITORY = "miszqr/Czytajaca-Wioska"
DEFAULT_API_BRANCH = "main"
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
MAX_FILE_BYTES = 100_000_000  # GitHub rejects files larger than 100 MB.


class PublishError(Exception):
    """A user-actionable error; never includes binary data or secrets."""


def run_git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args], cwd=REPO_ROOT, capture_output=True, text=True, check=False
    )


def validate_asset(path: str) -> tuple[Path, str]:
    requested = Path(path)
    absolute = (REPO_ROOT / requested).resolve() if not requested.is_absolute() else requested.resolve()
    try:
        relative = absolute.relative_to(REPO_ROOT.resolve())
    except ValueError as exc:
        raise PublishError("Asset must be inside the repository checkout.") from exc
    if not absolute.is_file():
        raise PublishError("Asset file does not exist.")
    if absolute.suffix.lower() not in IMAGE_EXTENSIONS:
        raise PublishError("Only image assets (PNG/JPG/JPEG/WEBP/GIF) are allowed.")
    if absolute.stat().st_size > MAX_FILE_BYTES:
        raise PublishError("File is larger than GitHub's 100 MB limit.")
    return absolute, relative.as_posix()


def verify_branch(branch: str) -> None:
    if not branch or run_git("check-ref-format", "--branch", branch).returncode != 0:
        raise PublishError("Invalid Git branch name.")


def current_branch() -> str:
    result = run_git("symbolic-ref", "--quiet", "--short", "HEAD")
    if result.returncode or not result.stdout.strip():
        raise PublishError("Detached HEAD: specify --branch explicitly.")
    return result.stdout.strip()


def find_token() -> str | None:
    token = os.getenv("GH_TOKEN") or os.getenv("GITHUB_TOKEN")
    if token:
        return token
    if shutil.which("gh"):
        result = subprocess.run(
            ["gh", "auth", "token"], capture_output=True, text=True, check=False
        )
        if result.returncode == 0:
            return result.stdout.strip() or None
    return None


def check_environment() -> None:
    remote = run_git("remote", "get-url", "origin")
    branch = run_git("symbolic-ref", "--quiet", "--short", "HEAD")
    print("git_origin_configured=" + str(remote.returncode == 0).lower())
    print("git_branch=" + (branch.stdout.strip() or "detached/unknown"))
    print("api_token_available=" + str(bool(find_token())).lower())
    print("note=git credentials and GitHub API permissions are not verified by --check")


def publish_git(relative: str, branch: str, message: str) -> str:
    if run_git("remote", "get-url", "origin").returncode:
        raise PublishError("No git origin remote is configured.")
    verify_branch(branch)
    if run_git("add", "--", relative).returncode:
        raise PublishError("git add failed.")
    staged = run_git("diff", "--cached", "--quiet", "--", relative)
    if staged.returncode == 0:
        raise PublishError("No change to this asset; nothing to commit.")
    if staged.returncode != 1:
        raise PublishError("Could not inspect staged changes.")
    # --only makes sure unrelated staged files are NOT included in this commit.
    if run_git("commit", "--only", "-m", message, "--", relative).returncode:
        raise PublishError("git commit failed (check git author configuration or hooks).")
    commit = run_git("rev-parse", "HEAD")
    if commit.returncode:
        raise PublishError("Unable to read local commit SHA.")
    push = run_git("push", "--quiet", "origin", f"HEAD:refs/heads/{branch}")
    if push.returncode:
        raise PublishError(
            "Commit created locally but git push failed. Configure git credentials; "
            "do not retry by pasting Base64 into chat. Local commit: " + commit.stdout.strip()
        )
    return commit.stdout.strip()


def github_request(url: str, token: str, *, payload: dict | None = None) -> dict:
    body = json.dumps(payload, separators=(",", ":")).encode("utf-8") if payload is not None else None
    request = Request(
        url,
        data=body,
        method="PUT" if payload is not None else "GET",
        headers={
            "Authorization": "Bearer " + token,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "Czytajaca-Wioska-binary-publisher",
            **({"Content-Type": "application/json"} if body is not None else {}),
        },
    )
    with urlopen(request, timeout=120) as response:
        return json.load(response)


def publish_api(relative: str, contents: bytes, repository: str, branch: str, message: str, token: str) -> str:
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
        raise PublishError("--repo must be in owner/repository form.")
    verify_branch(branch)
    url = "https://api.github.com/repos/" + repository + "/contents/" + quote(relative, safe="/")
    old_sha = None
    try:
        old = github_request(url + "?" + urlencode({"ref": branch}), token)
        old_sha = old["sha"]
    except HTTPError as exc:
        if exc.code != 404:
            raise PublishError(f"GitHub API lookup failed: HTTP {exc.code}.") from None
    except (URLError, OSError) as exc:
        raise PublishError("Cannot reach GitHub API for file lookup.") from exc

    payload = {
        "message": message,
        "branch": branch,
        "content": base64.b64encode(contents).decode("ascii"),
    }
    if old_sha is not None:
        payload["sha"] = old_sha
    try:
        result = github_request(url, token, payload=payload)
        return result["commit"]["sha"]
    except HTTPError as exc:
        raise PublishError(
            f"GitHub API upload failed: HTTP {exc.code} (check token permissions, "
            "branch protection, or concurrent changes)."
        ) from None
    except (URLError, OSError) as exc:
        raise PublishError("Cannot reach GitHub API for upload.") from exc
    # The Base64 string is kept inside this process; it is never printed.


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?", help="image path inside this checkout")
    parser.add_argument("--method", choices=("git", "api"), default="git")
    parser.add_argument("--repo", default=DEFAULT_REPOSITORY)
    parser.add_argument("--branch", help="target branch (git: current branch; api: main)")
    parser.add_argument("--message", help="commit message")
    parser.add_argument("--check", action="store_true", help="show which transports are configured")
    args = parser.parse_args(argv)
    try:
        if args.check:
            check_environment()
            return 0
        if not args.path:
            parser.error("an image path is required unless --check is used")
        absolute, relative = validate_asset(args.path)
        message = args.message or f"Add or update image asset: {relative}"
        if args.method == "git":
            sha = publish_git(relative, args.branch or current_branch(), message)
            size = absolute.stat().st_size
            digest = hashlib.sha256(absolute.read_bytes()).hexdigest()
        else:
            token = find_token()
            if not token:
                raise PublishError(
                    "GitHub API token missing: provide GH_TOKEN/GITHUB_TOKEN or login with gh. "
                    "The connected ChatGPT GitHub app does not expose a shell token."
                )
            data = absolute.read_bytes()
            size = len(data)
            digest = hashlib.sha256(data).hexdigest()
            sha = publish_api(relative, data, args.repo, args.branch or DEFAULT_API_BRANCH, message, token)
        print(f"UPLOAD_OK path={relative} bytes={size} sha256={digest} commit={sha}")
        return 0
    except PublishError as exc:
        print("UPLOAD_FAILED: " + str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
