import PropTypes from 'prop-types';

function PasswordInput({ placeholder, name, label, onChange, register, error, disabled }) {
  return (
    <div className='my-2'>
      <div className="font-medium">{label}</div>
      <input
        className={`block w-full px-3 py-2 bg-white border border-blue-400 rounded-md text-sm shadow-sm placeholder:text-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                ${
                  error && 'border-rose-500 text-rose-500 focus:border-rose-500 focus:ring-rose-500'
                }`}
                // px-3 text-sm py-1 mt-5 border-blue-400 w-full border rounded-lg placeholder:text-sm
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        type="password"
        {...register(name)}
      />
      <p className={`text-sm text-rose-500 text-right ${error && '-mb-4'}`}>{error || ''}</p>
    </div>
  );
}

PasswordInput.defaultProps = {
  disabled: false,
  error: '',
  label: '',
  name: '',
  placeholder: ''
};

PasswordInput.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.any,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  register: PropTypes.func
};

export default PasswordInput;
