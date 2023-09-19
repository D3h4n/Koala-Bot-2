import fs, { Dirent } from 'node:fs'
import { resolve, join } from 'node:path'

const commandFileRegEx = /^(\w.*)(.command.ts)$/

async function main() {
  const commands = findCommandsInDirectory(join(__dirname, 'commands'))
  const imports = commands.map(({ path, name }) => ({
    name: filenameToCommandName(name),
    path: generateImportFilePath(path, name),
  }))

  const output =
    '/* AutoGenerated by generateCommandImports.ts */\n' +
    "import Command from './command';" +
    imports.map(({ name, path }) => `import ${name} from '${path}'`).join(';') +
    `;const commands: Command[] = [${imports.map(({ name }) => `new ${name}()`).join(',')}]` +
    `;export default commands` +
    `;export {${imports.map(({ name }) => name).join(',')}}`

  fs.writeFileSync(join(__dirname, 'commands.ts'), output)
}

function generateImportFilePath(path: string, name: string): string {
  const result = join(path, name).match(/^(.*src)(.*)(.ts)$/)

  if (!result) throw new Error('Invalid path')

  return `.${result[2].replaceAll('\\', '/')}`
}

function filenameToCommandName(filename: string) {
  const result = filename.match(commandFileRegEx)

  if (!result) throw new Error('Invalid ')

  const name = result[1]

  return `${name[0].toLocaleUpperCase()}${name.slice(1)}Command`
}

function findCommandsInDirectory(dir: string): Dirent[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirEntry) => {
      const path = resolve(dirEntry.path, dirEntry.name)
      return !dirEntry.isDirectory() ? dirEntry : findCommandsInDirectory(path)
    })
    .filter(({ name }) => commandFileRegEx.test(name))
}

if (module === require.main) {
  main()
}
