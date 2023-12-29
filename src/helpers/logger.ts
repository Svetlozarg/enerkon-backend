import chalk from "chalk";

export function info(message: string) {
  console.log(chalk.bgBlue(`INFO: ${message}`));
}

export function error(message: string) {
  console.error(chalk.bgRed(`ERROR: ${message}`));
}

export function success(message: string) {
  console.log(chalk.bgGreen(`${message}`));
}
