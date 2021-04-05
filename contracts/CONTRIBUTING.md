
# Contribution guidelines
:warning:  Please make sure to read all the guidelines written in this document before you start coding.

#### Table Of Contents

[Required software](#required-software)
[Git](#git)
- [Some Git rules](#some-git-rules)
- [Git workflow](#git-workflow)
- [Writing good commit messages](#writing-good-commit-messages)

[Coding style guidelines](#coding-style-guidelines)
[Coding standards](#coding-standards-and-best-practices)
[Recommended developer tools & configuration](#recommended-developer-tools--configuration) 
* [Code quality](#code-quality) 
* [Prettier](#Prettier) 
* [Node version locking](#node-version-locking)


## Required Software

You will need the following things installed in order to run the app:

- Nodejs `v14.15`. We **strongly** recommend you install via [NVM](https://github.com/creationix/nvm) to avoid incompatibility issues between different node projects.

```
   brew install nvm
   nvm install v14.15
   nvm use v14.15
```

- Check that the correct node (v14.15) and npm (6.14.11) versions are installed

```
    node -v
    npm -v
```
- Hardhat - for compiling, testing and debugging smart contracts. Read their [Quick Start](https://hardhat.org/getting-started/#quick-start) for more details.
```
npm install --save-dev hardhat
```
- Metamask  
[How to install](https://metamask.io/)

## Git
  
### 1.1 Some Git rules
There are a set of rules to keep in mind:

* Perform work in a feature branch. All new work should be completed in feature branches until deemed stable enough for merging to `develop`
 
    _Why:_
    >Because this way all work is done in isolation on a dedicated branch rather than the main branch. It allows you to submit multiple pull requests without confusion. You can iterate without polluting the master branch with potentially unstable, unfinished code. [read more...](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow)
* Branch out from `develop`
    
    _Why:_
    >This way, you can make sure that code in master will almost always build without problems, and can be mostly used directly for releases (this might be overkill for some projects).

* Never push into `develop` or `master` branch. Make a Pull Request.
    
    _Why:_
    > It notifies team members that they have completed a feature. It also enables easy peer-review of the code and dedicates forum for discussing the proposed feature.

* All new work must include unit & integration tests as appropriate to prove correct functioning of the code.

* Before making a Pull Request, make sure your feature branch builds successfully and passes all tests (including code style checks).
    
    _Why:_
    > You are about to add your code to a stable branch. If your feature-branch tests fail, there is a high chance that your destination branch build will fail too. Additionally, you need to apply code style check before making a Pull Request. It aids readability and reduces the chance of formatting fixes being mingled in with actual changes.

* Protect your `develop` and `master` branch.
  
    _Why:_
    > It protects your production-ready branches from receiving unexpected and irreversible changes. read more... [Github](https://help.github.com/articles/about-protected-branches/), [Bitbucket](https://confluence.atlassian.com/bitbucketserver/using-branch-permissions-776639807.html) and [GitLab](https://docs.gitlab.com/ee/user/project/protected_branches.html)

<a name="git-workflow"></a>
### 1.2 Git workflow
We use [Feature-branch-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow). We highly encourage you to use a Git client like  [GitKraken](https://www.gitkraken.com/download) or [SourceTree](https://www.sourcetreeapp.com/).

The main steps are as follows:

1. For a new project, initialize a git repository in the project directory. __For subsequent features/changes this step should be ignored__.
   ```sh
   cd <project directory>
   git init
   ```

2. Checkout a new feature/bug-fix branch.
    ```sh
    git checkout -b <branchname>
    ```
    Follow our naming convention for branch
```feature/HDF-XXX-description```
3. Make Changes.
    ```sh
    git add <file1> <file2> ...
    git commit
    ```
    _Why:_
    > `git add <file1> <file2> ... ` - you should add only files that make up a small and coherent change.
    
    > `git commit` will start an editor which lets you separate the subject from the body. 
    
    > Read more about it in *section 1.3*.
    
    _Tip:_
    > You could use `git add -p` instead, which will give you chance to review all of the introduced changes one by one, and decide whether to include them in the commit or not.

* Sync with remote to get changes you’ve missed.
    ```sh
    git checkout develop
    git pull
    ```
    
    _Why:_
    > This will give you a chance to deal with conflicts on your machine while rebasing (later) rather than creating a Pull Request that contains conflicts.
    
4. Make a Pull Request.
5. Assign two or more reviewers for your PR. 
6. Pull request should be reviewed and approved by at least 2 approvers.
7. Once PR is approved, PR will be merged and close by the requester.
8. After merging, ensure that the remote bra nch is deleted from github. Note that `git flow feature finish` automates this.

<a name="writing-good-commit-messages"></a>
### 1.3 Writing good commit messages

Having a good guideline for creating commits and sticking to it makes working with Git and collaborating with others a lot easier. 

* Commit messages should take the imperative form; ie. finish the sentence _"Applying this commit will [...]"_ 

    _Why:_
    > Rather than writing messages that say what a committer has done. It's better to consider these messages as the instructions for what is going to be done after the commit is applied on the repository. [read more...](https://news.ycombinator.com/item?id=2079612)


 * Use the body to explain **what** and **why** as opposed to **how**.
 * Separate the subject from the body with a newline between the two.

    _Why:_
    > Git is smart enough to distinguish the first line of your commit message as your summary. In fact, if you try git shortlog, instead of git log, you will see a long list of commit messages, consisting of the id of the commit, and the summary only.

 * Limit the subject line to 50 characters and Wrap the body at 72 characters.

    _why_
    > Commits should be as fine-grained and focused as possible, it is not the place to be verbose. [read more...](https://medium.com/@preslavrachev/what-s-with-the-50-72-rule-8a906f61f09c)

 * Capitalize the subject line.
 * Do not end the subject line with a period.
 * Use [imperative mood](https://en.wikipedia.org/wiki/Imperative_mood) in the subject line.

## Coding Style Guidelines
Code consistency, readability and maintainability are important to us. We strictly require you to check and follow the specific guidelines listed below. Clean code matters!
#### Specific
- [Solidity](https://docs.soliditylang.org/en/v0.8.3/style-guide.html)
- [Javascript](https://www.w3schools.com/js/js_conventions.asp)

#### General
- Annotate your functions.
- Use descriptive words to name your variables.  Do not abbreviate function or variable names.
 **Bad**
```getAllocPt```
**Good**
```getAllocationPoints```
- Name your functions starting with an action word followed by a phrase or name of the object. The function name needs to communicate the intention of the function.
**Bad**
```unclaimedRewards()```
**Good**
```getUnclaimedRewards()```
- Always comment and keep them relevant as code changes. Remove commented blocks of code.
- Remove unused codes. Do not comment them out.
- Remove unused files.
- Organize your functions in a file according to the step-down rule. Higher level functions should be on top and lower levels below. Public functions should be on top, private or internal below.
#### Test Scripts
-   Construct a thoughtfully-worded, well-structured  `describe` statement.
-   Treat  `describe`  as situation or a user story.
-   Treat  `it`  as a statement about state or how an operation changes state.


## Coding Standards and Best Practices

* Always apply the DRY (Don't Repeat Yourself) Principle.
* Code quality is enforced by [prettier](https://github.com/prettier/prettier-vscode). You should set these tools up in your editor to enforce consistent code formatting across the project.
* We use Gitflow as our branching model. It is recommended to [install it](https://danielkummer.github.io/git-flow-cheatsheet/) for your environment to enable helper commands. More or less, you'll usually only use `git flow feature start`, &hellip;`feature finish`, &hellip;`feature publish` and occasionally &hellip;`release start/finish/publish`.
* Ensure the appropriate git username & password is set up for this repository: `git config user.name XXXX && git config user.email XXXX`.

#### Solidity
* [Common Patterns](https://docs.soliditylang.org/en/v0.8.2/common-patterns.html)
* [Something to keep in mind about loops.](https://docs.soliditylang.org/en/v0.8.2/security-considerations.html?highlight=save%20gas#gas-limit-and-loops)

#### React


## Recommended Developer Tools & Configuration

### Code quality

#### Prettier

You may follow base configurations for Prettier here https://github.com/prettier/prettier-vscode.

Install a plugin for your editor according to the following:

- **VSCode:** - `Prettier - Code formatter` via the marketplace (esbenp.prettier-vscode)

#### Node version locking

This project uses [`.nvmrc` files](https://github.com/creationix/nvm#nvmrc) to specify the correct nodejs versions to run when developing. You can install some additional shell hooks into [zsh on OSX](https://github.com/creationix/nvm#zsh) or place this in your `.bashrc` on Linux:

```
cd () { builtin cd "$@" && chNodeVersion; }
pushd () { builtin pushd "$@" && chNodeVersion; }
popd () { builtin popd "$@" && chNodeVersion; }
chNodeVersion() {
    if [ -f ".nvmrc" ] ; then
        nvm use;
    fi
}
chNodeVersion;
```

See submodules for further VSCode tooling such as tslint in the serverless repo and eslint in the web repo

