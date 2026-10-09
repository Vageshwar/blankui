import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils"

export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://blank.vageshwar.dev/docs/lint#${name}`,
)

/** Functions whose string arguments are treated as class names. */
const classFunctions = new Set(["cn", "clsx", "cva", "cx", "twMerge", "twJoin", "classNames"])
const classAttributes = new Set(["className", "class"])

/** A class string found in the source, with the node to report on. */
export interface ClassString {
  value: string
  node: TSESTree.Node
}

/** True when this string literal sits inside a className attribute or a cn()/cva() call. */
export function isClassContext(node: TSESTree.Node): boolean {
  let current: TSESTree.Node | undefined = node.parent
  while (current) {
    if (current.type === "JSXAttribute") {
      return current.name.type === "JSXIdentifier" && classAttributes.has(current.name.name)
    }
    if (current.type === "CallExpression") {
      const callee = current.callee
      if (callee.type === "Identifier" && classFunctions.has(callee.name)) return true
    }
    if (current.type === "JSXElement" || current.type === "Program") return false
    current = current.parent
  }
  return false
}

/** Visitor helpers: call `check` for each class string in a className or class helper call. */
export function classStringVisitors(check: (s: ClassString) => void) {
  return {
    Literal(node: TSESTree.Literal) {
      if (typeof node.value === "string" && isClassContext(node)) check({ value: node.value, node })
    },
    TemplateElement(node: TSESTree.TemplateElement) {
      if (isClassContext(node)) check({ value: node.value.cooked ?? node.value.raw, node })
    },
  }
}

/** Split a class string into class names. */
export function splitClasses(value: string): string[] {
  return value.split(/\s+/).filter(Boolean)
}

/** The utility part of a class, without variants: "md:hover:bg-primary/90" -> "bg-primary/90". */
export function utilityOf(className: string): string {
  let depth = 0
  let last = 0
  for (let i = 0; i < className.length; i++) {
    const ch = className[i]
    if (ch === "[" || ch === "(") depth++
    else if (ch === "]" || ch === ")") depth--
    else if (ch === ":" && depth === 0) last = i + 1
  }
  return className.slice(last).replace(/^!/, "")
}

/** The tag name of a JSX element, or undefined for member expressions like <Foo.Bar>. */
export function jsxName(node: TSESTree.JSXOpeningElement): string | undefined {
  return node.name.type === "JSXIdentifier" ? node.name.name : undefined
}

/** The literal string value of a JSX attribute, if it has one. */
export function jsxAttributeString(
  node: TSESTree.JSXOpeningElement,
  name: string,
): string | undefined {
  for (const attr of node.attributes) {
    if (attr.type !== "JSXAttribute" || attr.name.type !== "JSXIdentifier") continue
    if (attr.name.name !== name || !attr.value) continue
    if (attr.value.type === "Literal" && typeof attr.value.value === "string")
      return attr.value.value
    if (
      attr.value.type === "JSXExpressionContainer" &&
      attr.value.expression.type === "Literal" &&
      typeof attr.value.expression.value === "string"
    ) {
      return attr.value.expression.value
    }
  }
  return undefined
}
