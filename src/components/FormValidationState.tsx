import { CheckCircleIcon } from "@chakra-ui/icons"
import { List, ListIcon, ListItem } from "@chakra-ui/react"
import { FieldError, FormState } from "react-hook-form"
import { ZodNumber, ZodObject, ZodRawShape, ZodString } from "zod"

type Props<TFieldValues, Schema> = {
  formState: FormState<TFieldValues>
  name: keyof TFieldValues
  schema: Schema
}

export default function FormValidationState<
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
>({ formState, name, schema }: Props<TFormValues, Schema>) {
  const { errors, dirtyFields, touchedFields } = formState

  const isDirty = !!dirtyFields[name]
  const isTouched = !!touchedFields[name]

  if (!isDirty && !isTouched) {
    return null
  }

  const zodType = schema.shape[name as string]

  if (!(zodType instanceof ZodString || zodType instanceof ZodNumber)) {
    throw new Error(
      "the schema for the given name must be ZodString or ZodNumber",
    )
  }

  const { checks } = (zodType as ZodString | ZodNumber)._def
  const hasNoMessageCheck = checks.some((check) => !check.message)
  if (hasNoMessageCheck) {
    throw new Error("each validation must contain a message")
  }

  const error = errors[name] as FieldError | undefined
  const errorTypes = error?.types ?? {}
  const errorMessages = Object.keys(errorTypes).reduce<string[]>(
    (messages, key) => {
      const value = errorTypes[key] as string | string[]
      if (Array.isArray(value)) {
        return [...messages, ...value]
      }
      return [...messages, value]
    },
    [],
  )

  const validationResults = checks.map((check) => {
    return {
      ...check,
      valid: !errorMessages.includes(check.message!),
    }
  })

  return (
    <List px={4} py={2} fontSize="sm" spacing={1}>
      {validationResults.map((result) => (
        <ListItem
          key={result.message}
          color={result.valid ? "teal.400" : "gray.400"}
        >
          <ListIcon as={CheckCircleIcon} />
          {result.message}
        </ListItem>
      ))}
    </List>
  )
}
