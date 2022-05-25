import { useState, forwardRef, useImperativeHandle } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';

const Snackbar = forwardRef((props, ref) => {
  const types = {
    success: {
      color: 'bg-green-600',
      message: 'Success!',
      logo: <CheckCircleIcon className="w-8 h-8" />
    },
    error: {
      color: 'bg-red-600',
      message: 'Failed!',
      logo: <XCircleIcon className="w-8 h-8" />
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(types.success);

  const show = () => {
    setIsOpen(true);
    setInterval(() => {
      setIsOpen(false);
    }, 3000);
  };

  const success = (message) => {
    setConfig({ ...types.success, ...{ message } });
    show();
  };

  const error = (message) => {
    setConfig({ ...types.error, ...{ message } });
    show();
  };

  useImperativeHandle(ref, () => ({ success, error }));

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2">
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`p-4 py-3 ${config.color} rounded-lg shadow-md flex items-center space-x-2 text-white`}
        >
          {config.logo}
          <p className="font-semibold">{config.message}</p>
        </div>
      </Transition>
    </div>
  );
});

Snackbar.displayName = 'Snackbar';

export default Snackbar;
