# Push StyleSync to GitHub

This environment could not reach GitHub, so the initial commit was prepared for you locally.

## One-command push (recommended)

Run this in Terminal (not Cursor):

```bash
cd /tmp/StyleSync-work
git push -u origin main
```

If `/tmp/StyleSync-work` was cleaned up, recreate from the bundle:

```bash
cd ~
git clone docs-bundle-placeholder  # see below
```

### From the git bundle

```bash
cd /tmp
rm -rf StyleSync-push
git clone /Users/romynissan/fashion-inventory-forecast/docs/stylesync-initial.bundle StyleSync-push
cd StyleSync-push
git remote add origin https://github.com/romynissan/StyleSync.git
git push -u origin main
```

If GitHub asks you to sign in, use a Personal Access Token as the password:
https://github.com/settings/tokens

Or install GitHub CLI and authenticate:

```bash
brew install gh
gh auth login
cd /tmp/StyleSync-push
git push -u origin main
```

## Deploy the live demo (Vercel)

1. After the push succeeds, open https://vercel.com/new
2. Import `romynissan/StyleSync`
3. Add env var `DATABASE_URL` = your Supabase connection string (`sslmode=require`)
4. Deploy → copy the URL into the README **Live Demo** section

Optional: rotate your Supabase password if it was ever shared in chat, then update `.env` and Vercel.
