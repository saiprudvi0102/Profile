# GitHub Pages Deployment

This site is ready for deployment as your primary resume website.

## Steps to Deploy

1. **Create a new GitHub repository** (e.g., `myprofile`)
2. **Push the contents of the `myprofile` folder** to the repository root:
   - Only files inside `myprofile` should be in the repo (not the parent Profile folder)
3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select branch: `main` (or `master`)
   - Folder: `/ (root)`
   - Save
4. **Wait for deployment**
   - Your site will be live at `https://<your-username>.github.io/<repo-name>/`

## Notes
- The `.nojekyll` file disables Jekyll processing, ensuring all assets are served correctly.
- Update your README.md with the live site link.
- For a custom domain, configure it in GitHub Pages settings.

---

For any issues, check the DEPLOYMENT.md for troubleshooting tips.