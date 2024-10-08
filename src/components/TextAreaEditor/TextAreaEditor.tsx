import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Importe os estilos do editor
import './TextAreaEditor.css'

type InputProps = {
  label: string
  rows: number
  placeholder?: string
  register: any
  value?: string
  onChange: (value: string) => void
}

const TextAreaEditor = ({
  label,
  rows,
  placeholder,
  register,
  value,
  onChange
}: InputProps) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      ['link', 'image'],
      ['clean']
    ]
  }

  const handleEditorChange = (content: string) => {
    onChange(content) // Retorna diretamente o conteúdo ao invés de um evento
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="editor-container">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-black">
          {label}
        </label>
      </div>
      <ReactQuill
        {...register}
        id="message"
        rows={rows}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 custom-scroll
       "
        placeholder={placeholder}
        value={value}
        onChange={handleEditorChange}
        modules={modules}
        formats={[
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'align',
          'link',
          'image',
          'clean'
        ]}></ReactQuill>
    </div>
  )
}

export default TextAreaEditor
