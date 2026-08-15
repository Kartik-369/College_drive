# Contributing to LabZip 🚀

First off, thank you for considering contributing to LabZip! Whether you are a fellow student at Darshan University or an open-source developer, your help is welcome to make lab submissions easier for everyone.

There are many ways to contribute, from improving the documentation to submitting bug reports and writing code.

## 🐛 Found a Bug?

If you find a bug (like a file not uploading or a UI glitch), please open an issue in the GitHub repository. Include:

* A clear and descriptive title
* Steps to reproduce the bug
* What you expected to happen vs. what actually happened
* Screenshots if applicable

## ✨ Want to Add a Feature?

If you have an idea for a new feature (e.g., dark mode, larger file limits, new folder categories):

1. Check the existing issues to see if someone has already suggested it
2. Open a new issue describing your idea and why it would be useful for the students
3. Wait for the maintainer to discuss the feature before you start writing code!

## 💻 How to Contribute Code

### 1. Fork & Clone

1. Fork the repository to your own GitHub account
2. Clone it to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/LabZip.git
cd LabZip
```

### 2. Set Up Locally

Follow the instructions in the `README.md` to set up the environment. You will need:

* Node.js for the React/Vite frontend
* Python 3.11+ for the FastAPI backend
* Docker (optional, but recommended for testing container builds)

### 3. Create a Branch

Always create a new branch for your work. Do not commit directly to `main`.

```bash
git checkout -b feature/your-awesome-feature
# or
git checkout -b fix/bug-name
```

### 4. Make Your Changes

* Keep your code clean and readable
* If you change the backend API, ensure you update the Swagger docs (`/docs`) or comments if necessary
* Test your changes locally to ensure both the frontend and backend communicate correctly

### 5. Commit and Push

Write clear, concise commit messages.

```bash
git commit -m "Add dark mode toggle to navigation bar"
git push origin feature/your-awesome-feature
```

### 6. Open a Pull Request (PR)

Go to the original LabZip repository on GitHub and click **Compare & pull request**.

* Describe what your PR does
* Link to any related issues (e.g., "Fixes #12")
* Wait for a review! We might suggest some changes before merging it

## 🤝 Code of Conduct

Please be respectful and patient. We are all here to learn and build something cool for the campus community!

---

**Questions?** Feel free to open an issue or reach out to the maintainers. Happy contributing! 🎉