import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

function SelectMenu({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  menuClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const selected = options.find(
    (option) => String(option.value) === String(value)
  )

  useEffect(() => {
    function handleOutsideClick(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  function choose(option) {
    onChange(option.value)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
      >
        <span
          className={
            selected
              ? 'truncate'
              : 'truncate text-slate-400'
          }
        >
          {selected?.label ?? placeholder}
        </span>

        <Icon
          name="chevronDown"
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open
              ? 'rotate-180 text-emerald-700'
              : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute left-0 z-50 mt-2 max-h-64 w-full min-w-full overflow-auto rounded-xl border border-emerald-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 ${menuClassName}`}
        >
          {options.map((option) => {
            const active =
              String(option.value) === String(value)

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => choose(option)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  active
                    ? 'bg-emerald-50 font-semibold text-emerald-800'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-800'
                }`}
              >
                <span>{option.label}</span>

                {active && (
                  <Icon
                    name="check"
                    className="h-4 w-4 text-emerald-700"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SelectMenu