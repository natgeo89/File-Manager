const COMMANDS = {
  up: "up",
  cd: 'cd',
  ls: 'ls',
  cat: 'cat',
  add: 'add',
  rn: 'rn',
  cp: 'cp',
  mv: 'mv',
  rm: 'rm',
  os: 'os',
  hash: 'hash',
  compress: 'compress',
  decompress: 'decompress',
  exit: '.exit',
};

const ARGS_CORRECT_NUMBER = {
  [COMMANDS.up]: 0,
  [COMMANDS.ls]: 0,
  [COMMANDS.cd]: 1,
  [COMMANDS.cat]: 1,
  [COMMANDS.add]: 1,
  [COMMANDS.rm]: 1,
  [COMMANDS.os]: 1,
  [COMMANDS.hash]: 1,
  [COMMANDS.rn]: 2,
  [COMMANDS.cp]: 2,
  [COMMANDS.mv]: 2,
  [COMMANDS.compress]: 2,
  [COMMANDS.decompress]: 2,
  [COMMANDS.exit]: 0,
};

export { COMMANDS, ARGS_CORRECT_NUMBER };
