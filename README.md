# Penguin - Anime CLI
<p align="center">
    <img src="https://i.postimg.cc/d37qkR7b/Penguin-logo.png" alt="Sublime's custom image"/>
</p>

### You need mpv video player for penguin to work. You can install the video player using [install_mpv.bat](https://rawcdn.githack.com/IJPenguin/Penguin-Cli/bacd6521ec7e540a458027a30d39018fc6ad01cb/bin/install_mpv.bat)

Penguin is a command-line interface (CLI) project written in JavaScript that allows users to conveniently watch anime on their PCs for free. With a simple installation process and an intuitive interface, Penguin makes anime streaming accessible and enjoyable for anime enthusiasts.

## Installation

To use Penguin, follow these easy steps:

1. Install Penguin globally using npm:

    ```
    npm install -g penguin-cli
    ```

2. Run the command:

    ```
    penguin
    ```

    You will be prompted to enter the name of the anime you want to watch.

## Features

1. Search for Anime: Enter the name of your favorite anime, and Penguin will provide you with a list of available options.

2. Easy Navigation: Use arrow keys to navigate through the list or move to the next page.

3. Start Watching: Once you find the desired anime, press enter, and Penguin will start playing it.

4. Subtitle Options: Currently, Penguin supports the subbed version, with plans to introduce options for both subbed and dubbed versions in the future.

## Dependencies

Penguin is powered by several Node.js libraries, including:

1. Chalk: For adding color to the command-line output.

2. Figlet: Creating ASCII art text for a stylish CLI header.

3. Inquirer: Handling user prompts for a smooth and interactive experience.

4. Ora: Adding loading spinners to enhance the user interface.

5. Axios: Making HTTP requests to fetch anime data.

6. Exec: Running shell commands for executing streaming actions.

## Contribution

Contributions to Penguin are welcome! If you have ideas for new features, improvements, or bug fixes, feel free to open an issue or submit a pull request. Please check the contribution guidelines before getting started.
License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

Special thanks to the open-source community and the developers behind the libraries used in this project.

Happy anime watching with Penguin! 🐧✨
