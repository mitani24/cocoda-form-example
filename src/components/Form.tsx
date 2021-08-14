import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  UseFormProps,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"
import { ZodType, ZodTypeDef } from "zod"

type Props<TFormValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode
  options?: UseFormProps<TFormValues>
  schema?: Schema
}

export default function Form<
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
    unknown,
    ZodTypeDef,
    unknown
  >,
>({ onSubmit, children, options, schema }: Props<TFormValues, Schema>) {
  const methods = useForm<TFormValues>({
    mode: "onTouched",
    resolver: schema && zodResolver(schema),
    ...options,
  })

  return (
    <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
      {children(methods)}
    </form>
  )
}
