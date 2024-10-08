import React, { useState } from 'react'

type TableTextAreaProps = {
  labels: string[]
  rows: number
  placeholders: string[]
  registers: string[][]
  onRegisterChange: (registers: string[][]) => void
}

const TableTextArea: React.FC<TableTextAreaProps> = ({
  labels,
  rows,
  placeholders,
  registers,
  onRegisterChange
}) => {
  const [inputs, setInputs] = useState<string[][]>(registers)

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const newInputs = [...inputs]
    newInputs[rowIndex][colIndex] = event.target.value
    setInputs(newInputs)
    onRegisterChange(newInputs)
  }
  return (
    <table>
      <thead>
        <tr>
          {labels.map((label, index) => (
            <th key={index} className="mb-2 text-sm font-medium text-black">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {labels.map((_, colIndex) => (
              <td key={colIndex}>
                <textarea
                  rows={1}
                  value={inputs[rowIndex][colIndex]}
                  onChange={(event) =>
                    handleInputChange(event, rowIndex, colIndex)
                  }
                  placeholder={placeholders[colIndex]}
                  className="block w-full px-8 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableTextArea
