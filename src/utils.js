function getUserName() {
  const cmdLineArgs = process.argv.slice(2);
  const userName =
    cmdLineArgs
      .find((arg) => arg.startsWith("--userName="))
      ?.replace("--userName=", "") ?? "Unknown User";

  return userName;
}

export {
  getUserName
}