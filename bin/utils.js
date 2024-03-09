import { exec } from "child_process";

async function checkAndInstallDependencies() {
	try {
		exec("mpv --version");
	} catch (error) {
		console.log("mpv is not installed. Installing...");
		exec("your-package-manager install mpv");
		console.log("mpv has been installed.");
	}

	try {
		exec("npm i");
	} catch (error) {
		console.log(
			"An error occurred while installing dependencies. Please install them manually using 'npm i' command."
		);
	}
}

export default { checkAndInstallDependencies };
