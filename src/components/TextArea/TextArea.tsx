type InputProps = {
  label: string
  rows: number
  placeholder?: string
}

const TextArea = (props: InputProps) => {
  return (
    <div>
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
        {props.label}
      </label>
      <textarea
        id="message"
        rows={props.rows}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
       "
        placeholder={props.placeholder}></textarea>
    </div>
  )
}

export default TextArea
