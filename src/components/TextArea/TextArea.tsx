import { ChangeEvent } from 'react'

type InputProps = {
  label: string
  rows: number
  name?: string
  placeholder?: string
  register: any
  value?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const TextArea = ({
  label,
  rows,
  placeholder,
  register,
  value,
  onChange
}: InputProps) => {
  return (
    <div>
      <label
        htmlFor="message"
        className="block mt-2 mb-1 text-sm font-medium text-black">
        {label}
      </label>
      <textarea
        {...register}
        id="message"
        rows={rows}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
       "
        placeholder={placeholder}
        value={value}
        onChange={onChange}></textarea>
    </div>
  )
}

export default TextArea
