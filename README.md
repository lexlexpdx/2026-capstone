# Spring/Summer 2026 Capstone Project

## Sprint 3 repository structure information

_Updated: May 19th, 2026_

During this sprint we will be using the `prototypes/` directory with dedicated branches
for each team. There are three subdirectories in the `prototypes/` directory:

- `prototypes/layout_exploration`
- `prototypes/react_data_display`
- `prototypes/thingsboard_widgets`

Each of these directories has their own working branch of the repository:

- `prototype-layout-exploration`
- `prototype-react-displays`
- `prototytpe-widget-evaluation`

**Note:** Keep all prototype-specific work inside your assigned prototype directory.
You can decide as a team how to organize this directory, but try to aim for a clean
and understandable directory structure.

## Recommended workflow

### 1. Update your local repository

```
git switch main
git pull origin main
```

### 2. Switch to your team's prototype branch

```
git switch <team branch name>
```

Replace the branch name with your team's branch name

### 3. Pull the latest changes from the prototype branch

```
git pull origin <team branch name>
```

Replace the branch name with your team's branch name

### 4. Create your own personal working branch

```
git switch -c <yourname/feature_description>
```

**Note:** Use your name a descriptive name of the feature your are working on.

**Examples:**

- lex/navigation_bar
- max/mock_senor_cards
- lokesh/widget_comparison

### 5. Make your changes

Remember to work only in your team's directory in `prototypes/`

### 6. Commit your changes

When you are ready to commit your changes to your branch, you can commit with the following:

```
git add .
```

Now is a great time for our team to practice writing meaningful commit messages! You have a couple of options when you commit changes. For short messages you can use the command line as follows:

```
git commit -m "<your commit message here>"
```

**Note:**

- Commit titles should be capitalized, in the imperitive form ("Fix bug" vs "Fixes bug")
- Limit titles to less than 50 characters

If you have a more detailed commit message you can also use the following:

```
git commit
```

This will open up your default text editor so you can write a longer commit message.  
**Example:**

```
Add navigation bar changes

New navigation bar changes as follows:
    - Updated header names
    - Changed background color
```

When you are done with your message you can save as you normally would for your default text editor (ex: for vim, `:wqa`)

If you haven't set a default editor, or don't like the one that is set you can use the following command to set it:

```
git config --global core.editor <editor>
```

Replace `<editor>` with your desired editor (ex: vim, nano, emacs, etc)

Here are a couple of resources for writing good commit messages:

- [How to write good commit messages](https://www.freecodecamp.org/news/writing-good-commit-messages-a-practical-guide/)
- [Beginners guide to Git with a team](https://dev.to/gladyspascual/a-beginner-s-guide-to-using-git-when-working-with-a-team-for-the-first-time-1hba)
- [The art of writing meaningful git commit messages](https://medium.com/@iambonitheuri/the-art-of-writing-meaningful-git-commit-messages-a56887a4cb49)
- [Practical git workflow for new software developers](https://medium.com/@iambonitheuri/the-art-of-writing-meaningful-git-commit-messages-a56887a4cb49)

### 7. Push your branch to GitHub

Once you have made your changes, push your branch changes up using the following command:

```
git push origin -u <your personal branch>
```

### 8. Create pull request

1. Open the repository on [GitHub](https://github.com/lexlexpdx/2026-capstone)
2. GitHub will show a **Compare & pull request** button, click the button
3. Set:
   - **Base branch** to your team's prototype branch
   - **Compare branch** to your personal branch
4. Add a title and description
5. Create the pull request

### 9. Merge into the prototype branch

After your pull request is reviewed, merge the pull request

## Additional resources

1. [Git switch documentation](https://git-scm.com/docs/git-switch)
2. [Git pull documentation](https://git-scm.com/docs/git-pull)
3. [Git push documentation](https://git-scm.com/docs/git-push)
