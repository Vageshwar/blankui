#!/usr/bin/env node
import { Command } from "commander"
import { add } from "./commands/add.ts"
import { doctor } from "./commands/doctor.ts"
import { init } from "./commands/init.ts"
import { update } from "./commands/update.ts"
import { log } from "./io.ts"

const program = new Command()
  .name("blankui")
  .description("Add BlankUI components to your project. Docs: https://blank.vageshwar.dev")
  .version("0.1.0")
  .option("--cwd <dir>", "project folder", process.cwd())
  .option("--registry <url>", "registry URL or local folder", "https://blank.vageshwar.dev")

const globals = () => program.opts<{ cwd: string; registry: string }>()

program
  .command("init")
  .description("set up tokens, themes, lint rules and the AGENTS.md section")
  .option("--no-install", "print install commands instead of running them")
  .action(async (opts: { install: boolean }) => {
    process.exitCode = await init({ ...globals(), install: opts.install })
  })

program
  .command("add")
  .description("add components, for example: blankui add button dialog (or: blankui add all)")
  .argument("[components...]")
  .option("--overwrite", "replace files that already exist", false)
  .option("--no-install", "print install commands instead of running them")
  .action(async (names: string[], opts: { overwrite: boolean; install: boolean }) => {
    process.exitCode = await add(names, { ...globals(), ...opts })
  })

program
  .command("doctor")
  .description("check the setup and report components that changed or are out of date")
  .action(async () => {
    process.exitCode = await doctor(globals())
  })

program
  .command("update")
  .description("update components and the AGENTS.md section (keeps files with local changes)")
  .argument("[components...]")
  .option("--force", "also replace files with local changes", false)
  .action(async (names: string[], opts: { force: boolean }) => {
    process.exitCode = await update(names, { ...globals(), ...opts })
  })

program.parseAsync().catch((error: unknown) => {
  log.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
