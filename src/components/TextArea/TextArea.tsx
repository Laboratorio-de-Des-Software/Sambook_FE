type InputProps = {
  label: string
  rows: number
  placeholder?: string
  register: any
}

const TextArea = ({ label, rows, placeholder, register }: InputProps) => {
  return (
    <div>
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
        {label}
      </label>
      <textarea
        {...register}
        id="message"
        rows={rows}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
       "
        placeholder={placeholder}></textarea>
    </div>
  )
}

export default TextArea
