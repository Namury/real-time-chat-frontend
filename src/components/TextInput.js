import PropTypes from 'prop-types';

function TextInput(props) {
  const { type, id, placeholder, name, label, onChange, register, error, disabled } = props;
  return (
    <div className="flex my-2flex-1 flex-col">
      <div className="font-medium">{label}</div>
      <input
        className={`block w-full px-3 py-2 bg-white border border-blue-400 rounded-md text-sm shadow-sm placeholder:text-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      ${error && 'border-rose-500 text-rose-500 focus:border-rose-500 focus:ring-rose-500'} `}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        type={type}
        disabled={disabled}
        {...register(name)}
      />
      <p className={`text-sm text-rose-500 text-right ${error && '-mb-4'}`}>{error || ''}</p>
    </div>
  );
}

TextInput.defaultProps = {
  label: '',
  name: '',
  placeholder: '',
  type: 'text',
  error: '',
  disabled: false
};

TextInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  register: PropTypes.any,
  error: PropTypes.any,
  disabled: PropTypes.bool
};

export default TextInput;
